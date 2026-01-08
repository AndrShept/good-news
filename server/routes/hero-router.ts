import { calculate } from '@/shared/calculate';
import { BANK_CONTAINER_COST, BASE_STATS, HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT, RESET_STATS_COST } from '@/shared/constants';
import { type QueueCraftItemJob, type RegenHealthJob, type RegenManaJob, jobName } from '@/shared/job-types';
import type {
  HeroOnlineData,
  MapUpdateEvent,
  PlaceUpdateEvent,
  QueueCraftItemSocketData,
  SelfHeroData,
  SelfMessageData,
  WalkMapCompleteData,
  WalkMapStartData,
} from '@/shared/socket-data-types';
import {
  type BuffInstance,
  type EquipmentSlotType,
  type ErrorResponse,
  type Hero,
  type ItemInstance,
  type PathNode,
  type QueueCraftItem,
  type Skill,
  type SuccessResponse,
  type TItemContainer,
  type WeaponHandType,
  buildingValues,
  createHeroSchema,
  statsSchema,
} from '@/shared/types';
import { buildPathWithObstacles } from '@/shared/utils';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, lt, lte, ne, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { io } from '..';
import { socketEvents } from '../../shared/socket-events';
import type { Context } from '../context';
import { mapTemplate } from '../data/map-template';
import { placeTemplate } from '../data/place-template';
import { db } from '../db/db';
import {
  buffInstanceTable,
  coreMaterialTypeEnum,
  heroTable,
  itemContainerTable,
  itemInstanceTable,
  locationTable,
  modifierTable,
  resourceTypeEnum,
  skillTable,
  skillsTypeEnum,
  slotEnum,
  stateTypeEnum,
} from '../db/schema';
import { queueCraftItemTable } from '../db/schema/queue-craft-item-schema';
import { serverState } from '../game/state/hero-state';
import { heroOnline } from '../lib/heroOnline';
import { generateRandomUuid, verifyHeroOwnership } from '../lib/utils';
import { validateHeroStats } from '../lib/validateHeroStats';
import { loggedIn } from '../middleware/loggedIn';
import { actionQueue } from '../queue/actionQueue';
import { equipmentService } from '../services/equipment-service';
import { heroService } from '../services/hero-service';
import { itemContainerService } from '../services/item-container-service';
import { queueCraftItemService } from '../services/queue-craft-item-service';
import { skillService } from '../services/skill-service';

export const heroRouter = new Hono<Context>()
  .get(
    '/',
    loggedIn,

    async (c) => {
      const userId = c.get('user')?.id as string;
      const stateHeroId = serverState.user.get(userId);
      let hero: Hero | null = null;
      if (!stateHeroId) {
        hero = (await db.query.heroTable.findFirst({
          where: eq(heroTable.userId, userId),
          with: {
            modifier: true,
            group: true,
            location: true,
            buffs: { with: { buffTemplate: true } },
            queueCraftItems: true,
            itemContainers: { columns: { id: true, type: true, name: true }, where: eq(itemContainerTable.type, 'BACKPACK') },
          },
        })) as Hero;
        if (!hero) {
          throw new HTTPException(404, {
            message: 'hero not found',
          });
        }

        console.log('FETCH HERO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        const equipments = await db.query.itemInstanceTable.findMany({
          where: and(eq(itemInstanceTable.ownerHeroId, hero.id), eq(itemInstanceTable.location, 'EQUIPMENT')),
          with: { itemTemplate: true },
        });
        const { createdAt, location, ...heroState } = hero;
        serverState.user.set(userId, hero.id);
        serverState.hero.set(hero.id, {
          ...heroState,
          equipments,
          modifier: hero.modifier!,
          buffs: hero.buffs ?? [],
          itemContainers: hero.itemContainers ?? [],
          location: {
            x: location!.x,
            y: location!.y,
            mapId: location?.mapId ?? null,
            placeId: location?.placeId ?? null,
            targetX: location?.targetX ?? null,
            targetY: location?.y ?? null,
          },
        });
        await heroOnline(hero.id);
      }

      const heroId = stateHeroId ?? hero?.id!;
      const stateHero = serverState.getHeroState(heroId);

      verifyHeroOwnership({ heroUserId: hero?.userId ?? stateHero.userId, userId });
      stateHero.offlineTimer = undefined;
      stateHero.isOnline = true;

      return c.json<SuccessResponse<Hero>>({
        success: true,
        message: 'hero fetched',
        data: stateHero as Hero,
      });
    },
  )
  .post('/create', loggedIn, zValidator('json', createHeroSchema), async (c) => {
    const { name, avatarImage, freeStatPoints, stat } = c.req.valid('json');

    validateHeroStats({
      freeStatPoints,
      stat,
      level: 1,
    });
    const userId = c.get('user')?.id as string;
    const nameExist = await db.query.heroTable.findFirst({
      where: eq(heroTable.name, name),
    });
    if (nameExist) {
      return c.json<ErrorResponse>(
        {
          message: 'Hero name already taken. Please try another name.',
          success: false,
          canShow: true,
        },
        409,
      );
    }
    const heroExist = await db.query.heroTable.findFirst({
      where: eq(heroTable.userId, userId),
    });
    const place = placeTemplate.find((p) => p.name === 'Solmer Town');
    if (!place) {
      throw new HTTPException(404, {
        message: 'place not found',
      });
    }

    if (heroExist) {
      throw new HTTPException(409, {
        message: 'Hero already exists for this user.',
      });
    }
    await db.transaction(async (tx) => {
      const characterImage = '/sprites/new/newb-mage.webp';
      const [newHero] = await tx
        .insert(heroTable)
        .values({
          id: generateRandomUuid(),
          stat,
          avatarImage,
          characterImage,
          name,
          userId,
          freeStatPoints,
          maxHealth: stat.constitution * HP_MULTIPLIER_COST,
          maxMana: stat.intelligence * MANA_MULTIPLIER_INT,
        })
        .returning();
      await tx.insert(modifierTable).values({
        id: generateRandomUuid(),
        heroId: newHero.id,
      });
      await tx.insert(locationTable).values({ placeId: place.id, heroId: newHero.id, x: place.x, y: place.y });

      await tx.insert(itemContainerTable).values({
        name: 'Main Backpack',
        type: 'BACKPACK',
        heroId: newHero.id,
      });
      await tx.insert(itemContainerTable).values({
        name: '1',
        type: 'BANK',
        heroId: newHero.id,
        placeId: place.id,
      });
      for (const skill of skillsTypeEnum.enumValues) {
        await tx.insert(skillTable).values({
          heroId: newHero.id,
          name: skill.toLowerCase(),
          type: skill,
        });
      }

      return newHero;
    });

    return c.json<SuccessResponse>({ message: 'hero created!', success: true });
  })
  .put(
    '/:id/stats/reset',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const userId = c.get('user')?.id as string;
      const hero = serverState.getHeroState(id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId });

      if (hero.goldCoins < RESET_STATS_COST) {
        return c.json<ErrorResponse>(
          {
            success: false,
            message: 'Not enough gold to reset stats.',
          },
          422,
        );
      }
      await db.transaction(async (tx) => {
        const [{ freeStatPoints, goldCoins, stat }] = await tx
          .update(heroTable)
          .set({
            freeStatPoints: hero.level * 10,
            goldCoins: hero.goldCoins - RESET_STATS_COST,
            stat: BASE_STATS,
          })
          .where(eq(heroTable.id, id))
          .returning({ freeStatPoints: heroTable.freeStatPoints, goldCoins: heroTable.goldCoins, stat: heroTable.stat });
        hero.freeStatPoints = freeStatPoints;
        hero.goldCoins = goldCoins;
        hero.stat = stat;
        await heroService(tx).updateModifier(hero.id);
      });

      return c.json<SuccessResponse>({ message: 'Hero stats have been reset successfully.', success: true });
    },
  )
  .put(
    '/:id/stats/confirm',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator(
      'json',
      statsSchema.extend({
        freeStatPoints: z.number({
          coerce: true,
        }),
      }),
    ),
    async (c) => {
      const userId = c.get('user')?.id as string;
      const { id } = c.req.valid('param');
      const { freeStatPoints, ...stat } = c.req.valid('json');

      const hero = serverState.getHeroState(id);

      validateHeroStats({ freeStatPoints, stat, level: hero.level });

      verifyHeroOwnership({ heroUserId: hero.userId, userId });
      await db.transaction(async (tx) => {
        await db
          .update(heroTable)
          .set({
            freeStatPoints,
            stat,
          })
          .where(eq(heroTable.id, id));
        hero.freeStatPoints = freeStatPoints;
        hero.stat = stat;
        await heroService(tx).updateModifier(hero.id);
      });

      return c.json<SuccessResponse>({ success: true, message: 'Stats have been successfully updated.' }, 200);
    },
  )
  .get(
    '/:id/item-container/:itemContainerId',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        itemContainerId: z.string(),
      }),
    ),
    async (c) => {
      const userId = c.get('user')?.id as string;
      const { id, itemContainerId } = c.req.valid('param');
      const heroState = serverState.getHeroState(id);
      let containerState = serverState.getContainerState(itemContainerId);
      if (!containerState) {
        console.log('FETCH CONTAINER !!!!!!!!!!!!!! CONTAINER');
        const itemContainer = await itemContainerService(db).getItemContainerById(itemContainerId);
        containerState = itemContainer;
        serverState.container.set(itemContainer.id, itemContainer);
      }

      verifyHeroOwnership({ heroUserId: heroState.userId, userId, containerHeroId: containerState.heroId, heroId: heroState.id });
      return c.json<SuccessResponse<TItemContainer>>({
        message: `container fetched !!!`,
        success: true,
        data: containerState,
      });
    },
  )

  .post(
    '/:id/inventory/:inventoryItemId/equip',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        inventoryItemId: z.string(),
      }),
    ),

    async (c) => {
      const { id, inventoryItemId } = c.req.valid('param');
      const userId = c.get('user')?.id as string;

      // const [inventoryItem, hero, itemContainer] = await Promise.all([
      //   containerSlotItemService(db).getContainerSlotItem(inventoryItemId, {
      //     with: {
      //       gameItem: { with: { weapon: true, armor: true } },
      //     },
      //   }),
      //   heroService(db).getHeroByColum(id, { id: true, userId: true }),
      //   itemContainerService(db).getHeroBackpack(id),
      // ]);
      // const isEquipment =
      //   inventoryItem?.gameItem?.type === 'ARMOR' ||
      //   inventoryItem?.gameItem?.type === 'WEAPON' ||
      //   inventoryItem?.gameItem?.type === 'SHIELD';

      // if (!isEquipment) {
      //   throw new HTTPException(403, {
      //     message: 'You cannot equip this item.',
      //   });
      // }
      // if (!inventoryItem.gameItem) {
      //   throw new HTTPException(403, {
      //     message: 'inventoryItem gameItem not found',
      //   });
      // }

      // verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: itemContainer.heroId, heroId: hero.id });
      // const slot = await equipmentService(db).getEquipSlot({
      //   itemContainerId: itemContainer.id,
      //   item: inventoryItem.gameItem,
      //   usedSlots: itemContainer.usedSlots,
      //   maxSlots: itemContainer.maxSlots,
      //   heroId: hero.id,
      // });

      // if (!slot) {
      //   throw new HTTPException(404, {
      //     message: 'slot not found',
      //   });
      // }
      // const existingEquipItem = await equipmentService(db).findEquipItem(slot, hero.id);

      // await db.transaction(async (tx) => {
      //   if (existingEquipItem) {
      //     await equipmentService(tx).unEquipItem({
      //       equipmentItemId: existingEquipItem.id,
      //       gameItemId: existingEquipItem.gameItemId,
      //       itemContainerId: itemContainer.id,
      //       usedSlots: itemContainer.usedSlots,
      //       maxSlots: itemContainer.maxSlots,
      //       heroId: hero.id,
      //     });
      //   }

      //   await equipmentService(tx).equipItem({
      //     gameItemId: inventoryItem.gameItemId,
      //     heroId: hero.id,
      //     slot,
      //     inventoryItemId: inventoryItem.id,
      //     itemContainerId: itemContainer.id,
      //   });
      // });

      // return c.json<SuccessResponse>(
      //   {
      //     success: true,
      //     message: 'success equipped item',
      //   },
      //   201,
      // );
    },
  )
  .post(
    '/:id/equipment/:equipmentItemId/unequip',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        equipmentItemId: z.string(),
      }),
    ),

    async (c) => {
      const { id, equipmentItemId } = c.req.valid('param');
      const userId = c.get('user')?.id as string;
      const heroState = serverState.getHeroState(id);
      const heroBackpack = await itemContainerService(db).getHeroBackpack(heroState.id);

      verifyHeroOwnership({ heroUserId: heroState.userId, userId, containerHeroId: heroBackpack.heroId, heroId: heroState.id });

      // await db.transaction(async (tx) => {
      //   await equipmentService(tx).unEquipItem({
      //     equipmentItemId: equipmentItem.id,
      //     gameItemId: equipmentItem.gameItemId,
      //     heroId: hero.id,
      //     maxSlots: heroBackpack.maxSlots,
      //     usedSlots: heroBackpack.usedSlots,
      //     itemContainerId: heroBackpack.id,
      //   });
      // });

      return c.json<SuccessResponse>(
        {
          success: true,
          message: `success unequipped item `,
        },
        201,
      );
    },
  )
  .delete(
    '/:id/item-container/slot-item/:containerSlotId',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        containerSlotId: z.string(),
      }),
    ),

    async (c) => {
      const { id, containerSlotId } = c.req.valid('param');
      const userId = c.get('user')?.id as string;
      const [hero, containerSlotItem] = await Promise.all([
        heroService(db).getHeroByColum(id, { id: true, userId: true }),
        containerSlotItemService(db).getContainerSlotItem(containerSlotId, { with: { gameItem: true } }),
      ]);

      const itemContainer = await itemContainerService(db).getItemContainerById(containerSlotItem.itemContainerId);

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: itemContainer.heroId, heroId: hero.id });

      // await db.transaction(async (tx) => {
      //   await tx.delete(containerSlotTable).where(eq(containerSlotTable.id, containerSlotItem.id));
      //   await itemContainerService(tx).setUsedSlots(itemContainer.id);
      // });

      return c.json<SuccessResponse>(
        {
          success: true,
          message: `Success deleted item`,
          // data: containerSlotItem,
        },
        201,
      );
    },
  )
  .post(
    '/:id/inventory/:inventoryItemId/drink',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        inventoryItemId: z.string(),
      }),
    ),
    async (c) => {
      const { id, inventoryItemId } = c.req.valid('param');
      const userId = c.get('user')?.id as string;
      const [inventoryItemPotion, hero] = await Promise.all([
        containerSlotItemService(db).getContainerSlotItem(inventoryItemId, {
          with: {
            gameItem: {
              with: {
                potion: true,
              },
            },
          },
        }),
        heroService(db).getHero(id),
      ]);

      if (inventoryItemPotion.gameItem?.type !== 'POTION') {
        throw new HTTPException(403, {
          message: 'This item not a potion',
        });
      }

      const isBuffPotion = inventoryItemPotion?.gameItem?.potion?.type === 'BUFF';
      const isHealthPotion = !!(inventoryItemPotion?.gameItem?.potion?.restore?.health ?? 0 > 0);
      const isManaPotion = !!(inventoryItemPotion?.gameItem?.potion?.restore?.mana ?? 0 > 0);
      const isRestorePotion = isHealthPotion && isManaPotion;

      const isFullHealth = hero.currentHealth >= hero.maxHealth;
      const isFullMana = hero.currentMana >= hero.maxMana;

      verifyHeroOwnership({ heroUserId: hero.userId, userId });

      if (hero.state === 'BATTLE') {
        throw new HTTPException(403, { message: 'You cannot use potions during battle.', cause: { canShow: true } });
      }
      if (isFullHealth && isHealthPotion && !isBuffPotion && !isRestorePotion) {
        throw new HTTPException(400, { message: 'You are already at full health', cause: { canShow: true } });
      }
      if (isFullHealth && isFullMana && !isBuffPotion && isRestorePotion) {
        throw new HTTPException(400, { message: 'You are already at full health and mana', cause: { canShow: true } });
      }
      if (isFullMana && isManaPotion && !isBuffPotion && !isRestorePotion) {
        throw new HTTPException(400, { message: 'You are already at full mana', cause: { canShow: true } });
      }

      await db.transaction(async (tx) => {
        await heroService(tx).drinkPotion({
          inventoryItemPotion,
          isBuffPotion,
          heroId: hero.id,
          currentHealth: hero.currentHealth,
          currentMana: hero.currentMana,
          maxHealth: hero.maxHealth,
          maxMana: hero.maxMana,
        });
        await containerSlotItemService(tx).decrementContainerSlotItemQuantity(
          inventoryItemPotion.id,
          hero.id,
          inventoryItemPotion.quantity,
        );
      });

      return c.json<SuccessResponse<ContainerSlot>>({
        success: true,
        message: `You drink `,
        data: inventoryItemPotion,
      });
    },
  )
  .get('/:id/buffs', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const userId = c.get('user')?.id;
    const { id } = c.req.valid('param');
    const hero = await heroService(db).getHero(id);

    verifyHeroOwnership({ heroUserId: hero.userId, userId });

    const buffs = await db.query.buffInstanceTable.findMany({
      where: eq(buffInstanceTable.ownerHeroId, hero.id),
    });
    return c.json<SuccessResponse<BuffInstance[]>>({
      message: 'buffs fetched!',
      success: true,
      data: buffs,
    });
  })

  .post(
    '/:id/action/walk-map',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'json',
      z.object({
        x: z.number(),
        y: z.number(),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const targetPos = c.req.valid('json');
      const heroState = serverState.getHeroState(id);

      verifyHeroOwnership({ heroUserId: heroState.userId, userId: user?.id });

      const heroPos = { x: heroState.location.x, y: heroState.location.y };
      const map = mapTemplate.find((m) => m.id === heroState.location.mapId);
      if (!map) throw new HTTPException(404, { message: 'map not found' });

      const MAP_WIDTH = map.width;
      const MAP_HEIGHT = map.height;

      const paths = buildPathWithObstacles(heroPos, targetPos, map.layers, MAP_WIDTH, MAP_HEIGHT);
      const sumDex = heroState.modifier.dexterity + heroState.stat.dexterity;

      if (!paths.length) {
        throw new HTTPException(409, {
          message: ' path not correct ',
        });
      }

      const walkTime = calculate.walkTime(sumDex);
      const now = Date.now();
      const walkPathWithTime: PathNode[] = paths.map((path, idx) => ({
        ...path,
        completedAt: now + walkTime * (idx + 1),
        mapId: heroState.location.mapId ?? '',
      }));

      const savePosQueue = serverState.pathPersistQueue.get(id);
      if (savePosQueue) {
        serverState.pathPersistQueue.delete(id);
      }

      heroState.paths = walkPathWithTime;
      heroState.state = 'WALK';
      heroState.location.targetX = targetPos.x;
      heroState.location.targetY = targetPos.y;

      const socketData: WalkMapStartData = {
        type: 'WALK_MAP_START',
        payload: {
          heroId: id,
          state: 'WALK',
        },
      };
      io.to(heroState.location.mapId!).emit(socketEvents.walkMap(), socketData);

      return c.json<SuccessResponse>({
        message: 'walking start',
        success: true,
      });
    },
  )
  .post(
    '/:id/action/walk-map/cancel',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const heroState = serverState.hero.get(id);

      if (!heroState) {
        throw new HTTPException(404, { message: 'hero nof found' });
      }
      verifyHeroOwnership({ heroUserId: heroState.userId, userId: user?.id });

      serverState.pathPersistQueue.set(id, { x: heroState.location.x, y: heroState.location.y });
      heroState.paths = [];
      heroState.state = 'IDLE';
      heroState.location.targetX = null;
      heroState.location.targetY = null;
      const socketData: WalkMapCompleteData = {
        type: 'WALK_MAP_COMPLETE',
        payload: {
          heroId: id,
          state: 'IDLE',
        },
      };
      io.to(heroState.location.mapId!).emit(socketEvents.walkMap(), socketData);

      return c.json<SuccessResponse>({
        message: 'walking cancel',
        success: true,
      });
    },
  )
  .post(
    '/:id/action/enter-place',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');

      const heroState = serverState.getHeroState(id);
      verifyHeroOwnership({ heroUserId: heroState.userId, userId: user?.id });

      if (heroState.state !== 'IDLE') {
        throw new HTTPException(409, {
          message: 'Hero is currently busy with another action',
        });
      }
      const heroPosX = heroState.location.x;
      const heroPosY = heroState.location.y;
      const place = placeTemplate.find((p) => p.x === heroPosX && p.y === heroPosY);
      if (!place) {
        throw new HTTPException(404, {
          message: 'place not found',
        });
      }

      await db
        .update(locationTable)
        .set({
          mapId: null,
          placeId: place.id,
        })
        .where(eq(locationTable.heroId, id));

      heroState.location.mapId = null;
      heroState.location.placeId = place.id;

      const socketPlaceData: PlaceUpdateEvent = {
        type: 'HERO_ENTER_PLACE',
        payload: {
          id: heroState.id,
          avatarImage: heroState.avatarImage,
          level: heroState.level,
          name: heroState.name,
          state: heroState.state,
        },
      };
      const socketMapData: MapUpdateEvent = {
        type: 'HERO_ENTER_PLACE',
        payload: {
          placeId: place.id,
          heroId: id,
        },
      };

      io.to(place.mapId).emit(socketEvents.mapUpdate(), socketMapData);
      io.to(place.id).emit(socketEvents.placeUpdate(), socketPlaceData);

      return c.json<SuccessResponse>({
        message: 'enter town success',
        success: true,
      });
    },
  )
  .post(
    '/:id/action/leave-place',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');

      const heroState = serverState.hero.get(id);
      if (!heroState) {
        throw new HTTPException(404, { message: 'heroState not found' });
      }
      if (!heroState.location.placeId) {
        throw new HTTPException(404, { message: 'heroState.location.placeId not found' });
      }
      if (heroState.state !== 'IDLE') {
        throw new HTTPException(409, {
          message: 'Hero is currently busy with another action',
        });
      }
      verifyHeroOwnership({ heroUserId: heroState.userId, userId: user?.id });

      const place = placeTemplate.find((p) => p.id === heroState.location.placeId);
      if (!place) {
        throw new HTTPException(404, {
          message: 'place not found',
        });
      }

      await db
        .update(locationTable)
        .set({
          mapId: place.mapId,
          x: place.x,
          y: place.y,
          placeId: null,
        })
        .where(eq(locationTable.heroId, id));
      heroState.location.mapId = place.mapId;
      heroState.location.placeId = null;
      heroState.location.x = place.x;
      heroState.location.y = place.y;

      const socketMapData: MapUpdateEvent = {
        type: 'HERO_LEAVE_PLACE',
        payload: {
          heroId: id,
          mapId: place.mapId,
          hero: {
            id: heroState.id,
            name: heroState.name,
            avatarImage: heroState.avatarImage,
            characterImage: heroState.characterImage,
            level: heroState.level,
            state: heroState.state,
            x: heroState.location.x,
            y: heroState.location.y,
          },
        },
      };
      const socketTownData: PlaceUpdateEvent = {
        type: 'HERO_LEAVE_PLACE',
        payload: {
          heroId: id,
          mapId: place.mapId,
        },
      };

      io.to(place.id).emit(socketEvents.placeUpdate(), socketTownData);
      io.to(place.mapId).emit(socketEvents.mapUpdate(), socketMapData);

      return c.json<SuccessResponse>({
        message: 'leave place success ',
        success: true,
      });
    },
  )
  .post(
    '/:id/regeneration/health',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      // const hero = await heroService(db).getHero(id);

      // verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      // const isFullHealth = hero.currentHealth >= hero.maxHealth;

      // if (hero.state === 'BATTLE') {
      //   throw new HTTPException(403, {
      //     message: 'hero is a battle',
      //   });
      // }
      // if (isFullHealth) {
      //   throw new HTTPException(403, {
      //     message: 'hero full HP',
      //   });
      // }

      // const jobId = `hero-${hero.id}-regen-health`;
      // const { sumStatAndModifier } = await heroService(db).getHeroStatsWithModifiers(hero.id);
      // const every = calculate.manaRegenTime(sumStatAndModifier.constitution);
      // console.log('healthTime', every);
      // const jobData: RegenHealthJob = {
      //   jobName: 'REGEN_HEALTH',
      //   payload: {
      //     heroId: hero.id,
      //     currentHealth: hero.currentHealth,
      //   },
      // };
      // const messageData: SelfMessageData = {
      //   message: 'Start health regen',
      //   type: 'INFO',
      // };
      // await actionQueue.upsertJobScheduler(
      //   jobId,
      //   { every, startDate: new Date(Date.now() + every) },
      //   { data: jobData, name: jobName['regen-health'], opts: { removeOnComplete: true } },
      // );
      // io.to(hero.id).emit(socketEvents.selfMessage(), messageData);
      // return c.json<SuccessResponse>({
      //   message: 'start regen health ',
      //   success: true,
      // });
    },
  )
  .post(
    '/:id/regeneration/mana',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');

      // const hero = await heroService(db).getHero(id);

      // verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      // const isFullMana = hero.currentMana >= hero.maxMana;

      // if (hero.state === 'BATTLE') {
      //   throw new HTTPException(403, {
      //     message: 'hero is a battle',
      //   });
      // }
      // if (isFullMana) {
      //   throw new HTTPException(403, {
      //     message: 'hero full MANA',
      //   });
      // }

      // const jobId = `hero-${hero.id}-regen-mana`;
      // const { sumStatAndModifier } = await heroService(db).getHeroStatsWithModifiers(hero.id);
      // const every = calculate.manaRegenTime(sumStatAndModifier.intelligence);
      // console.log('manaTime', every);
      // const jobData: RegenManaJob = {
      //   jobName: 'REGEN_MANA',
      //   payload: {
      //     heroId: hero.id,
      //     currentMana: hero.currentMana,
      //   },
      // };
      // const messageData: SelfMessageData = {
      //   message: 'Start mana regen',
      //   type: 'INFO',
      // };
      // await actionQueue.upsertJobScheduler(
      //   jobId,
      //   { every, startDate: new Date(Date.now() + every) },
      //   { data: jobData, name: jobName['regen-mana'], opts: { removeOnComplete: true } },
      // );
      // io.to(hero.id).emit(socketEvents.selfMessage(), messageData);
      // return c.json<SuccessResponse>({
      //   message: 'start regen mana ',
      //   success: true,
      // });
    },
  )
  .put(
    '/:id/state',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),
    zValidator('json', z.object({ type: z.enum(stateTypeEnum.enumValues) })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const { type } = c.req.valid('json');

      const hero = await heroService(db).getHeroByColum(id, { id: true, userId: true });

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      await db
        .update(heroTable)
        .set({
          state: type,
        })
        .where(eq(heroTable.id, hero.id));

      return c.json<SuccessResponse>({
        message: 'state changed',
        success: true,
      });
    },
  )
  .get(
    '/:id/queue/craft-item/:buildingType',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        buildingType: z.enum(buildingValues),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { id, buildingType } = c.req.valid('param');
      const hero = await heroService(db).getHero(id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });
      const queueCraftItems = await db.query.queueCraftItemTable.findMany({
        where: and(eq(queueCraftItemTable.heroId, hero.id), eq(queueCraftItemTable.buildingType, buildingType)),
        orderBy: asc(queueCraftItemTable.createdAt),
      });

      return c.json<SuccessResponse<QueueCraftItem[]>>({
        message: 'craft item add to queue',
        success: true,
        data: queueCraftItems,
      });
    },
  )
  .post(
    '/:id/action/queue-craft',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'json',
      z.object({
        coreMaterialType: z.optional(z.enum(coreMaterialTypeEnum.enumValues)),
        buildingType: z.enum(buildingValues),
        craftItemId: z.string(),
      }),
    ),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      // const { craftItemId, coreMaterialType, buildingType } = c.req.valid('json');
      // const hero = serverState.getHeroState(id);
      // const [craftItem, coreMaterial, backpack] = await Promise.all([

      //   itemContainerService(db).getHeroBackpack(id),
      // ]);
      // verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });
      // const place = placeTemplate.find((p) => p.id === hero.location.placeId);
      // const isNotInsideRequiredBuilding = place?.buildings?.every((b) => b.type !== craftItem.requiredBuildingType);
      // if (isNotInsideRequiredBuilding) {
      //   throw new HTTPException(400, {
      //     message: 'You are not inside the required place building.',
      //     cause: { canShow: true },
      //   });
      // }
      // if (backpack.usedSlots >= backpack.maxSlots) {
      //   throw new HTTPException(400, {
      //     message: 'Inventory is full',
      //     cause: { canShow: true },
      //   });
      // }

      // if (coreMaterial && coreMaterial?.category !== craftItem.requiredCraftResourceCategory) {
      //   throw new HTTPException(400, {
      //     message: 'Invalid base resource for this craft item.',
      //     cause: { canShow: true },
      //   });
      // }

      // const requirement = craftItemService(db).getCraftItemRequirement(craftItem.gameItem!, coreMaterialType);
      // await itemContainerService(db).checkCraftResources(backpack.id, requirement?.resources);
      // await skillService(db).checkSkillRequirement(hero.id, requirement?.skills);
      // const heroQueueCraftItems = await db.query.queueCraftItemTable.findMany({
      //   where: and(eq(queueCraftItemTable.heroId, hero.id), ne(queueCraftItemTable.status, 'FAILED')),
      // });
      // if (heroQueueCraftItems.length >= hero.maxQueueCraftCount) {
      //   throw new HTTPException(400, {
      //     message: 'Craft queue limit has been reached.',
      //     cause: { canShow: true },
      //   });
      // }

      // const lastItem = heroQueueCraftItems.at(-1);

      // if (lastItem && lastItem?.buildingType !== craftItem.requiredBuildingType) {
      //   throw new HTTPException(400, {
      //     message: 'You can only queue items from the same building type.',
      //     cause: { canShow: true },
      //   });
      // }
      // if (!requirement?.craftTime) {
      //   throw new HTTPException(404, {
      //     message: 'craft time not found',
      //   });
      // }
      // let delay = requirement.craftTime;

      // if (lastItem) {
      //   const now = Date.now();
      //   const completedAt = new Date(lastItem.completedAt).getTime();

      //   const remainingTime = Math.max(0, completedAt - now);

      //   delay = remainingTime + requirement.craftTime;
      // }

      // const completedAt = new Date(Date.now() + delay).toISOString();
      // const randomUuid = generateRandomUuid();
      // const jobId = `hero-${hero.id}_queue-craft-${randomUuid}`;
      // const [newQueueCraftItem] = await db
      //   .insert(queueCraftItemTable)
      //   .values({
      //     heroId: hero.id,
      //     buildingType: craftItem.requiredBuildingType,
      //     jobId,
      //     coreMaterialType,
      //     status: !lastItem ? 'PROGRESS' : 'PENDING',
      //     craftItemId: craftItem.id,
      //     completedAt,
      //   })
      //   .returning();
      // const jobData: QueueCraftItemJob = {
      //   jobName: 'QUEUE_CRAFT_ITEM',
      //   payload: {
      //     heroId: hero.id,
      //     queueCraftItemId: newQueueCraftItem.id,
      //     coreMaterialType,
      //     buildingType: craftItem.requiredBuildingType,
      //   },
      // };
      // console.log('@@@@@@@', delay);
      // await actionQueue.add(jobName['queue-craft-item'], jobData, {
      //   delay,
      //   jobId,
      //   removeOnComplete: true,
      // });

      return c.json<SuccessResponse<QueueCraftItem>>({
        message: 'craft item add to queue',
        success: true,
        // data: newQueueCraftItem,
      });
    },
  )
  .delete(
    '/:id/action/queue-craft/:queueCraftItemId',
    loggedIn,
    zValidator('param', z.object({ id: z.string(), queueCraftItemId: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id, queueCraftItemId } = c.req.valid('param');

      // const [hero, queueItems] = await Promise.all([
      //   heroService(db).getHeroByColum(id, { id: true, userId: true, state: true }),
      //   db.query.queueCraftItemTable.findMany({
      //     where: eq(queueCraftItemTable.heroId, id),
      //     with: { craftItem: { with: { gameItem: true } } },
      //   }),
      // ]);

      // verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      // if (hero.state === 'BATTLE') {
      //   throw new HTTPException(409, { message: 'Action not allowed: hero now is battle' });
      // }

      // const deletedItem = queueItems.find((i) => i.id === queueCraftItemId);
      // if (!deletedItem) {
      //   throw new HTTPException(404, { message: 'queue craft item not found' });
      // }

      // await db.delete(queueCraftItemTable).where(eq(queueCraftItemTable.id, queueCraftItemId));

      // await actionQueue.remove(deletedItem.jobId);

      // const remaining = queueItems.filter((i) => i.id !== queueCraftItemId);

      // const progressJob = remaining.find((i) => i.status === 'PROGRESS');
      // const pendingJobs = remaining.filter((i) => i.status === 'PENDING');

      // if (!progressJob && pendingJobs.length > 0) {
      //   const next = await queueCraftItemService(db).setNextQueueCraftItem(hero.id);
      //   if (next) {
      //     const updateData: QueueCraftItemSocketData = {
      //       type: 'QUEUE_CRAFT_ITEM_STATUS_UPDATE',
      //       payload: {
      //         queueItemCraftId: next.id,
      //         status: 'PROGRESS',
      //         completedAt: next.completedAt,
      //         buildingType: deletedItem.buildingType,
      //       },
      //     };
      //     io.to(hero.id).emit(socketEvents.queueCraft(), updateData);
      //   }
      // }

      // let delayAccumulator = 0;

      // if (progressJob) {
      //   const remainingMs = Math.max(new Date(progressJob.completedAt).getTime() - Date.now(), 0);
      //   delayAccumulator = remainingMs;
      // }

      // for (const item of pendingJobs) {
      //   const requirement = craftItemService(db).getCraftItemRequirement(item.craftItem.gameItem, item.coreMaterialType);
      //   if (!requirement?.craftTime) {
      //     console.error('FOR CRAFT ITEM NOT FOUND');
      //     continue;
      //   }
      //   delayAccumulator += requirement.craftTime;

      //   const job = await actionQueue.getJob(item.jobId);
      //   if (job) {
      //     await job.changeDelay(delayAccumulator);
      //   }
      // }

      // return c.json<SuccessResponse>({
      //   message: 'queue craft item deleted',
      //   success: true,
      // });
    },
  )
  .get('/:id/skills', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    const hero = await heroService(db).getHeroByColum(id, {
      id: true,
      userId: true,
    });
    const skills = await db.query.skillTable.findMany({
      where: eq(skillTable.heroId, hero.id),
    });

    verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

    return c.json<SuccessResponse<Skill[]>>({
      message: 'skills fetched',
      success: true,
      data: skills,
    });
  })
  .get('/:id/item-container', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');
    const hero = await heroService(db).getHero(id, {
      with: {
        location: { columns: { placeId: true } },
      },
      columns: {
        id: true,
        userId: true,
      },
    });

    const itemContainers = await db.query.itemContainerTable.findMany({
      where: and(eq(itemContainerTable.heroId, hero.id), eq(itemContainerTable.placeId, hero.location?.placeId!)),
      orderBy: asc(itemContainerTable.createdAt),
    });

    verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

    return c.json<SuccessResponse<TItemContainer[]>>({
      message: 'bank containers fetched',
      success: true,
      data: itemContainers,
    });
  })
  .post('/:id/item-container/create', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    const hero = await heroService(db).getHero(id, {
      with: {
        location: { columns: { placeId: true } },
      },
    });
    const count = await db.$count(itemContainerTable, and(eq(itemContainerTable.heroId, hero.id), eq(itemContainerTable.type, 'BANK')));
    verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

    const newPremiumCoinsValue = await db.transaction(async (tx) => {
      await tx.insert(itemContainerTable).values({
        heroId: hero.id,
        placeId: hero.location?.placeId,
        type: 'BANK',
        name: `${count + 1}`,
      });
      const premiumCoins = await heroService(tx).spendPremCoin(hero.id, BANK_CONTAINER_COST, hero.premiumCoins);
      return premiumCoins;
    });

    return c.json<SuccessResponse<{ newPremiumCoinsValue: number }>>({
      message: 'bank container create!',
      success: true,
      data: { newPremiumCoinsValue },
    });
  })
  .put(
    '/:id/item-container/:itemContainerId',
    loggedIn,
    zValidator('param', z.object({ id: z.string(), itemContainerId: z.string() })),
    zValidator('json', z.object({ name: z.string().optional(), color: z.string().optional() })),
    async (c) => {
      const user = c.get('user');
      const { id, itemContainerId } = c.req.valid('param');
      const data = c.req.valid('json');
      const [hero, itemContainer] = await Promise.all([
        heroService(db).getHero(id, {
          columns: { id: true, userId: true },
        }),
        itemContainerService(db).getItemContainerById(itemContainerId),
      ]);
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id, heroId: hero.id, containerHeroId: itemContainer.heroId });

      await db
        .update(itemContainerTable)
        .set({
          ...data,
        })
        .where(eq(itemContainerTable.id, itemContainerId));

      return c.json<SuccessResponse>({
        message: 'bank container changed!',
        success: true,
      });
    },
  );

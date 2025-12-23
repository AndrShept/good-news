import { calculate } from '@/shared/calculate';
import { BANK_CONTAINER_COST, BASE_STATS, HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT, RESET_STATS_COST } from '@/shared/constants';
import {
  type QueueCraftItemJob,
  type RegenHealthJob,
  type RegenManaJob,
  type WalkMapJob,
  type WalkPlaceJob,
  jobName,
} from '@/shared/job-types';
import type {
  HeroOnlineData,
  MapUpdateEvent,
  PlaceUpdateEvent,
  QueueCraftItemSocketData,
  SelfHeroData,
  SelfMessageData,
} from '@/shared/socket-data-types';
import {
  type Buff,
  type ContainerSlot,
  type Equipment,
  type EquipmentSlotType,
  type ErrorResponse,
  type GameItem,
  type GameItemType,
  type Hero,
  type QueueCraftItem,
  type Skill,
  type SuccessResponse,
  type TItemContainer,
  type WeaponHandType,
  createHeroSchema,
  statsSchema,
} from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { randomUUIDv7 } from 'bun';
import { and, asc, desc, eq, lt, lte, ne, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { io } from '..';
import { HeroIcon } from '../../frontend/src/components/game-icons/HeroIcon';
import { capitalize } from '../../frontend/src/lib/utils';
import type { GameMessageType } from '../../frontend/src/store/useGameMessages';
import { socketEvents } from '../../shared/socket-events';
import type { Context } from '../context';
import { db } from '../db/db';
import {
  actionTable,
  buildingTypeEnum,
  containerSlotTable,
  coreMaterialTypeEnum,
  craftItemTable,
  equipmentTable,
  gameItemEnum,
  gameItemTable,
  heroTable,
  itemContainerTable,
  itemContainerTypeEnum,
  locationTable,
  modifierTable,
  placeTable,
  resourceTable,
  resourceTypeEnum,
  skillTable,
  skillsTypeEnum,
  slotEnum,
  stateTable,
  stateTypeEnum,
} from '../db/schema';
import { buffTable } from '../db/schema/buff-schema';
import { queueCraftItemTable } from '../db/schema/queue-craft-item-schema';
import { heroOnline } from '../lib/heroOnline';
import { generateRandomUuid, getTileExists, jobQueueId, setSqlNow, setSqlNowByInterval, verifyHeroOwnership } from '../lib/utils';
import { validateHeroStats } from '../lib/validateHeroStats';
import { loggedIn } from '../middleware/loggedIn';
import { actionQueue } from '../queue/actionQueue';
import { containerSlotItemService } from '../services/container-slot-item-service';
import { craftItemService } from '../services/craft-item-service';
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

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.userId, userId),
        with: {
          modifier: true,
          group: true,
          action: {
            extras: {
              timeRemaining: sql<number>`EXTRACT(EPOCH FROM ${actionTable.completedAt} - NOW())::INT`.as('timeRemaining'),
            },
          },
          equipments: {
            with: {
              gameItem: {
                with: {
                  accessory: true,
                  armor: true,
                  weapon: true,
                  shield: true,
                },
              },
            },
          },
          queueCraftItems: true,
          itemContainers: { columns: { id: true, type: true, name: true }, where: eq(itemContainerTable.type, 'BACKPACK') },
          state: true,
          location: {
            with: {
              place: true,
            },
          },
        },
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId });
      if (!hero.isOnline) {
        await heroOnline(hero.id);
      }

      return c.json<SuccessResponse<Hero>>({
        success: true,
        message: 'hero fetched',
        data: hero as Hero,
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
    const place = await db.query.placeTable.findFirst({
      where: eq(placeTable.name, 'Solmer Town'),
    });
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
      await tx.insert(actionTable).values({
        completedAt: setSqlNow(),
        type: 'IDLE',
        heroId: newHero.id,
      });
      await tx.insert(stateTable).values({ type: 'IDLE', heroId: newHero.id });
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
          name: capitalize(skill),
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
      const hero = await heroService(db).getHero(id);

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
        await tx
          .update(heroTable)
          .set({
            freeStatPoints: hero.level * 10,
            goldCoins: hero.goldCoins - RESET_STATS_COST,
            stat: BASE_STATS,
          })
          .where(eq(heroTable.id, id));
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

      const hero = await heroService(db).getHero(id);

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
      const [hero, itemContainer] = await Promise.all([
        heroService(db).getHero(id),
        itemContainerService(db).getItemContainerById(itemContainerId, {
          with: {
            containerSlots: {
              orderBy: asc(containerSlotTable.createdAt),
              with: {
                gameItem: { with: { weapon: true, armor: true, accessory: true, shield: true, potion: true, resource: true } },
              },
            },
          },
        }),
      ]);

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: itemContainer.heroId, heroId: hero.id });
      return c.json<SuccessResponse<TItemContainer>>({
        message: `container fetched !!!`,
        success: true,
        data: itemContainer,
      });
    },
  )
  .post(
    '/:id/shop/items/:gameItemId/buy',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        gameItemId: z.string(),
      }),
    ),
    async (c) => {
      const { id, gameItemId } = c.req.valid('param');
      const userId = c.get('user')?.id as string;

      const gameItem = await db.query.gameItemTable.findFirst({
        where: eq(gameItemTable.id, gameItemId),
      });
      if (!gameItem) throw new HTTPException(404, { message: 'Game item not found' });

      const quantity = 6;
      const result = await db.transaction(async (tx) => {
        const hero = await heroService(tx).getHero(id);
        const itemContainer = await itemContainerService(tx).getHeroBackpack(id);
        verifyHeroOwnership({ heroUserId: hero.userId, userId, heroId: hero.id, containerHeroId: itemContainer.heroId });
        const itemPrice = quantity * gameItem.price;
        const { data } = await containerSlotItemService(tx).obtainInventoryItem({
          currentInventorySlots: itemContainer.usedSlots,
          maxInventorySlots: itemContainer.maxSlots,
          gameItemId: gameItem.id,
          gameItemType: gameItem.type,
          itemContainerId: itemContainer.id,
          quantity,
        });
        await heroService(tx).spendGold(hero.id, itemPrice, hero.goldCoins);
        return data;
      });

      return c.json<SuccessResponse<ContainerSlot>>(
        {
          success: true,
          message: `You successfully obtain the`,
          data: { ...result, gameItem: gameItem as GameItem, quantity },
        },
        201,
      );
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

      const [inventoryItem, hero, itemContainer] = await Promise.all([
        containerSlotItemService(db).getContainerSlotItem(inventoryItemId, {
          with: {
            gameItem: { with: { weapon: true, armor: true } },
          },
        }),
        heroService(db).getHero(id),
        itemContainerService(db).getHeroBackpack(id),
      ]);
      const isEquipment =
        inventoryItem?.gameItem?.type === 'ARMOR' ||
        inventoryItem?.gameItem?.type === 'WEAPON' ||
        inventoryItem?.gameItem?.type === 'SHIELD';

      if (!isEquipment) {
        throw new HTTPException(403, {
          message: 'You cannot equip this item.',
        });
      }
      if (!inventoryItem.gameItem) {
        throw new HTTPException(403, {
          message: 'inventoryItem gameItem not found',
        });
      }

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: itemContainer.heroId, heroId: hero.id });
      const slot = await equipmentService(db).getEquipSlot({
        itemContainerId: itemContainer.id,
        item: inventoryItem.gameItem,
        usedSlots: itemContainer.usedSlots,
        maxSlots: itemContainer.maxSlots,
        heroId: hero.id,
      });

      if (!slot) {
        throw new HTTPException(404, {
          message: 'slot not found',
        });
      }
      const existingEquipItem = await equipmentService(db).findEquipItem(slot, hero.id);

      await db.transaction(async (tx) => {
        if (existingEquipItem) {
          await equipmentService(tx).unEquipItem({
            equipmentItemId: existingEquipItem.id,
            gameItemId: existingEquipItem.gameItemId,
            itemContainerId: itemContainer.id,
            usedSlots: itemContainer.usedSlots,
            maxSlots: itemContainer.maxSlots,
            heroId: hero.id,
          });
        }

        await equipmentService(tx).equipItem({
          gameItemId: inventoryItem.gameItemId,
          heroId: hero.id,
          slot,
          inventoryItemId: inventoryItem.id,
          itemContainerId: itemContainer.id,
        });
      });

      return c.json<SuccessResponse<GameItem>>(
        {
          success: true,
          message: 'success equipped item',
          data: inventoryItem.gameItem,
        },
        201,
      );
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
      const [hero, equipmentItem] = await Promise.all([
        heroService(db).getHero(id),
        equipmentService(db).getEquipItem(equipmentItemId, { with: { gameItem: true } }),
      ]);
      const heroBackpack = await itemContainerService(db).getHeroBackpack(hero.id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: heroBackpack.heroId, heroId: hero.id });
      await db.transaction(async (tx) => {
        await equipmentService(tx).unEquipItem({
          equipmentItemId: equipmentItem.id,
          gameItemId: equipmentItem.gameItemId,
          heroId: hero.id,
          maxSlots: heroBackpack.maxSlots,
          usedSlots: heroBackpack.usedSlots,
          itemContainerId: heroBackpack.id,
        });
      });

      return c.json<SuccessResponse<Equipment>>(
        {
          success: true,
          message: `success unequipped item `,
          data: equipmentItem,
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
      const hero = await heroService(db).getHero(id);
      const containerSlotItem = await containerSlotItemService(db).getContainerSlotItem(containerSlotId, { with: { gameItem: true } });
      const itemContainer = await itemContainerService(db).getItemContainerById(containerSlotItem.itemContainerId);

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: itemContainer.heroId, heroId: hero.id });

      await db.transaction(async (tx) => {
        await tx.delete(containerSlotTable).where(eq(containerSlotTable.id, containerSlotItem.id));
        await itemContainerService(tx).setUsedSlots(itemContainer.id);
      });

      return c.json<SuccessResponse<ContainerSlot>>(
        {
          success: true,
          message: `Success deleted item`,
          data: containerSlotItem,
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

      if (hero.isInBattle) {
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

    const buffs = await db.query.buffTable.findMany({
      where: eq(buffTable.heroId, hero.id),
    });
    return c.json<SuccessResponse<Buff[]>>({
      message: 'buffs fetched!',
      success: true,
      data: buffs,
    });
  })

  .post(
    '/:id/action/cancel',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const hero = await heroService(db).getHero(id, {
        with: {
          action: { columns: { id: true } },
        },
      });

      if (!hero.action?.id) {
        throw new HTTPException(404, {
          message: 'action id not found',
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      await db
        .update(actionTable)
        .set({
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          type: 'IDLE',
        })
        .where(eq(actionTable.id, hero.action.id));

      const jobId = hero.id;
      await actionQueue.remove(jobId);

      return c.json<SuccessResponse>({
        message: 'action canceled',
        success: true,
      });
    },
  )

  .post(
    '/:id/action/back-town-entry',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const hero = await heroService(db).getHero(id, {
        with: { location: { columns: { id: true } } },
      });

      if (!hero.location?.id) {
        throw new HTTPException(404, {
          message: 'location id not found',
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });
      await db
        .update(locationTable)
        .set({
          currentBuilding: null,
        })
        .where(eq(locationTable.id, hero.location.id));

      return c.json<SuccessResponse>({
        message: 'action updated',
        success: true,
      });
    },
  )
  .post(
    '/:id/action/walk-place',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'json',
      z.object({
        buildingType: z.enum(buildingTypeEnum.enumValues),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const { buildingType } = c.req.valid('json');
      const hero = await heroService(db).getHero(id, {
        with: {
          modifier: { columns: { dexterity: true } },
          location: { with: { place: true }, columns: { id: true } },
          action: { columns: { id: true } },
        },
      });

      if (!hero.action?.id) {
        throw new HTTPException(404, {
          message: 'action id not found',
        });
      }
      if (!hero.location?.id) {
        throw new HTTPException(404, {
          message: 'location id not found',
        });
      }
      if (!hero.location?.place?.id) {
        throw new HTTPException(403, {
          message: 'Missing townId: hero is not assigned to a town',
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      const jobId = hero.id;
      const sumDex = (hero.modifier?.dexterity ?? 0) + hero.stat.dexterity;
      const delay = calculate.walkTime(sumDex);
      await db
        .update(actionTable)
        .set({
          startedAt: new Date().toISOString(),
          completedAt: new Date(Date.now() + delay).toISOString(),
          type: 'WALK',
        })
        .where(eq(actionTable.id, hero.action.id));
      const jobData: WalkPlaceJob = {
        jobName: 'WALK_PLACE',
        payload: {
          actionId: hero.action.id,
          locationId: hero.location.id,
          heroId: hero.id,
          type: 'IDLE',
          buildingType,
        },
      };
      await actionQueue.remove(jobId);
      await actionQueue.add(jobName['walk-place'], jobData, {
        delay,
        jobId,
        removeOnComplete: true,
      });

      return c.json<SuccessResponse>({
        message: 'action start',
        success: true,
      });
    },
  )
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
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
        with: {
          modifier: {
            columns: {
              dexterity: true,
            },
          },
          location: { with: { map: true } },
          action: { columns: { id: true } },
        },
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
      if (!hero.action) {
        throw new HTTPException(404, {
          message: 'hero action not found',
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      const MAP_WIDTH = hero.location?.map?.width ?? 0;
      const tileIndex = targetPos.y * MAP_WIDTH + targetPos.x;
      const tileExistMap = getTileExists(hero.location?.mapId ?? '', tileIndex, 'GROUND');
      const waterTile = getTileExists(hero.location?.mapId ?? '', tileIndex, 'WATER');
      const objectTile = getTileExists(hero.location?.mapId ?? '', tileIndex, 'OBJECT');
      if (waterTile) {
        throw new HTTPException(403, {
          message: `Movement blocked: tile at (${targetPos.x}, ${targetPos.y}) is WATER.`,
        });
      }
      if (objectTile) {
        throw new HTTPException(403, {
          message: `Movement blocked: tile at (${targetPos.x}, ${targetPos.y}) is OBJECT.`,
        });
      }
      if (!tileExistMap) {
        throw new HTTPException(403, {
          message: `Tile at position (${targetPos.x}, ${targetPos.y}) does not exist on the map`,
        });
      }
      if (!hero.location) {
        throw new HTTPException(409, {
          message: ' Hero is not on the world map. ',
        });
      }
      const isMovable =
        Math.abs(hero.location?.x! - targetPos.x) <= 1 &&
        Math.abs(hero.location?.y! - targetPos.y) <= 1 &&
        !(hero.location.x === targetPos.x && hero.location.y === targetPos.y);
      if (!isMovable) {
        throw new HTTPException(409, {
          message: ' Hero can only move to an adjacent tile. ',
        });
      }

      const jobId = hero.id;
      const sumDex = (hero.modifier?.dexterity ?? 0) + hero.stat.dexterity;
      const delay = calculate.walkTime(sumDex);
      await db
        .update(actionTable)
        .set({
          startedAt: new Date().toISOString(),
          completedAt: new Date(Date.now() + delay).toISOString(),
          type: 'WALK',
        })
        .where(eq(actionTable.id, hero.action?.id!));
      const jobData: WalkMapJob = {
        jobName: 'WALK_MAP',
        payload: {
          heroId: hero.id,
          actionId: hero.action.id,
          newPosition: targetPos,
          mapId: hero.location.mapId ?? '',
        },
      };
      await actionQueue.remove(jobId);
      await actionQueue.add(jobName['walk-map'], jobData, {
        delay,
        jobId,
        removeOnComplete: true,
      });

      return c.json<SuccessResponse>({
        message: 'walking start',
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
      const hero = await heroService(db).getHero(id, {
        with: {
          location: true,
          action: true,
        },
      });

      if (!hero.location) {
        throw new HTTPException(404, {
          message: 'hero location not found',
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      if (hero.action?.type !== 'IDLE') {
        throw new HTTPException(409, {
          message: 'Hero is currently busy with another action',
        });
      }
      const heroPosX = hero.location?.x;
      const heroPosY = hero.location?.y;
      const place = await db.query.placeTable.findFirst({
        where: and(eq(placeTable.x, heroPosX), eq(placeTable.y, heroPosY)),
      });
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
        .where(eq(locationTable.heroId, hero.id));

      const socketMapData: MapUpdateEvent = {
        type: 'HERO_ENTER_PLACE',
        payload: {
          placeId: place.id,
          heroId: hero.id,
        },
      };
      const socketTownData: PlaceUpdateEvent = {
        type: 'HERO_ENTER_PLACE',
        payload: { ...hero.location, hero: hero as Hero },
      };
      io.to(hero.location.mapId!).emit(socketEvents.mapUpdate(), socketMapData);
      io.to(place.id).emit(socketEvents.placeUpdate(), socketTownData);

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
      const hero = await heroService(db).getHero(id, {
        with: {
          location: { with: { hero: true } },
          action: true,
        },
      });

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      if (hero.action?.type !== 'IDLE') {
        throw new HTTPException(409, {
          message: 'Hero is currently busy with another action',
        });
      }
      if (!hero.location?.placeId) {
        throw new HTTPException(403, {
          message: 'Missing placeId: hero is not assigned to a place',
        });
      }
      const place = await db.query.placeTable.findFirst({
        where: eq(placeTable.id, hero.location.placeId),
      });
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
        .where(eq(locationTable.heroId, hero.id));

      const socketMapData: MapUpdateEvent = {
        type: 'HERO_LEAVE_PLACE',
        payload: {
          heroId: hero.id,
          mapId: place.mapId,
          location: hero.location,
        },
      };
      const socketTownData: PlaceUpdateEvent = {
        type: 'HERO_LEAVE_PLACE',
        payload: {
          heroId: hero.id,
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
      const hero = await heroService(db).getHero(id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      const isFullHealth = hero.currentHealth >= hero.maxHealth;

      if (hero.isInBattle) {
        throw new HTTPException(403, {
          message: 'hero is a battle',
        });
      }
      if (isFullHealth) {
        throw new HTTPException(403, {
          message: 'hero full HP',
        });
      }

      const jobId = `hero-${hero.id}-regen-health`;
      const { sumStatAndModifier } = await heroService(db).getHeroStatsWithModifiers(hero.id);
      const every = calculate.manaRegenTime(sumStatAndModifier.constitution);
      console.log('healthTime', every);
      const jobData: RegenHealthJob = {
        jobName: 'REGEN_HEALTH',
        payload: {
          heroId: hero.id,
          currentHealth: hero.currentHealth,
        },
      };
      const messageData: SelfMessageData = {
        message: 'Start health regen',
        type: 'INFO',
      };
      await actionQueue.upsertJobScheduler(
        jobId,
        { every, startDate: new Date(Date.now() + every) },
        { data: jobData, name: jobName['regen-health'], opts: { removeOnComplete: true } },
      );
      io.to(hero.id).emit(socketEvents.selfMessage(), messageData);
      return c.json<SuccessResponse>({
        message: 'start regen health ',
        success: true,
      });
    },
  )
  .post(
    '/:id/regeneration/mana',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');

      const hero = await heroService(db).getHero(id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      const isFullMana = hero.currentMana >= hero.maxMana;

      if (hero.isInBattle) {
        throw new HTTPException(403, {
          message: 'hero is a battle',
        });
      }
      if (isFullMana) {
        throw new HTTPException(403, {
          message: 'hero full MANA',
        });
      }

      const jobId = `hero-${hero.id}-regen-mana`;
      const { sumStatAndModifier } = await heroService(db).getHeroStatsWithModifiers(hero.id);
      const every = calculate.manaRegenTime(sumStatAndModifier.intelligence);
      console.log('manaTime', every);
      const jobData: RegenManaJob = {
        jobName: 'REGEN_MANA',
        payload: {
          heroId: hero.id,
          currentMana: hero.currentMana,
        },
      };
      const messageData: SelfMessageData = {
        message: 'Start mana regen',
        type: 'INFO',
      };
      await actionQueue.upsertJobScheduler(
        jobId,
        { every, startDate: new Date(Date.now() + every) },
        { data: jobData, name: jobName['regen-mana'], opts: { removeOnComplete: true } },
      );
      io.to(hero.id).emit(socketEvents.selfMessage(), messageData);
      return c.json<SuccessResponse>({
        message: 'start regen mana ',
        success: true,
      });
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

      const hero = await heroService(db).getHero(id, {
        with: {
          action: true,
          state: { columns: { id: true } },
        },
      });

      if (!hero.action) {
        throw new HTTPException(404, {
          message: 'hero action not found',
        });
      }
      if (!hero.state?.id) {
        throw new HTTPException(404, {
          message: 'state id not found',
        });
      }

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });
      if (hero.action.type !== 'IDLE') {
        throw new HTTPException(409, {
          message: 'Your hero is busy now',
        });
      }
      if (hero.isInBattle) {
        throw new HTTPException(409, {
          message: 'Action not allowed: hero now is battle',
        });
      }
      await db
        .update(stateTable)
        .set({
          type,
        })
        .where(eq(stateTable.id, hero.state.id));

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
        buildingType: z.enum(buildingTypeEnum.enumValues),
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
        buildingType: z.enum(buildingTypeEnum.enumValues),
        craftItemId: z.string(),
      }),
    ),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const { craftItemId, coreMaterialType, buildingType } = c.req.valid('json');

      const [hero, craftItem, coreMaterial, backpack] = await Promise.all([
        heroService(db).getHero(id, {
          with: {
            action: true,
            state: { columns: { id: true } },
            location: { with: { place: true } },
          },
        }),
        craftItemService(db).getCraftItem(craftItemId, { with: { gameItem: { with: { weapon: true, armor: true, shield: true } } } }),
        coreMaterialType && db.query.resourceTable.findFirst({ where: eq(resourceTable.type, coreMaterialType) }),
        itemContainerService(db).getHeroBackpack(id),
      ]);
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });
      const isNotInsideRequiredBuilding = hero.location?.place?.buildings?.every((b) => b.type !== craftItem.requiredBuildingType);
      if (isNotInsideRequiredBuilding) {
        throw new HTTPException(400, {
          message: 'You are not inside the required place building.',
          cause: { canShow: true },
        });
      }
      if (backpack.usedSlots >= backpack.maxSlots) {
        throw new HTTPException(400, {
          message: 'Inventory is full',
          cause: { canShow: true },
        });
      }

      if (coreMaterial && coreMaterial?.category !== craftItem.requiredCraftResourceCategory) {
        throw new HTTPException(400, {
          message: 'Invalid base resource for this craft item.',
          cause: { canShow: true },
        });
      }

      const requirement = craftItemService(db).getCraftItemRequirement(craftItem.gameItem!, coreMaterialType);
      await itemContainerService(db).checkCraftResources(backpack.id, requirement?.resources);
      await skillService(db).checkSkillRequirement(hero.id, requirement?.skills);
      const heroQueueCraftItems = await db.query.queueCraftItemTable.findMany({
        where: and(eq(queueCraftItemTable.heroId, hero.id), ne(queueCraftItemTable.status, 'FAILED')),
      });
      if (heroQueueCraftItems.length >= hero.maxQueueCraftCount) {
        throw new HTTPException(400, {
          message: 'Craft queue limit has been reached.',
          cause: { canShow: true },
        });
      }

      const lastItem = heroQueueCraftItems.at(-1);

      if (lastItem && lastItem?.buildingType !== craftItem.requiredBuildingType) {
        throw new HTTPException(400, {
          message: 'You can only queue items from the same building type.',
          cause: { canShow: true },
        });
      }
      if (!requirement?.craftTime) {
        throw new HTTPException(404, {
          message: 'craft time not found',
        });
      }
      let delay = requirement.craftTime;

      if (lastItem) {
        const now = Date.now();
        const completedAt = new Date(lastItem.completedAt).getTime();

        const remainingTime = Math.max(0, completedAt - now);

        delay = remainingTime + requirement.craftTime;
      }

      const completedAt = new Date(Date.now() + delay).toISOString();
      const randomUuid = generateRandomUuid();
      const jobId = `hero-${hero.id}_queue-craft-${randomUuid}`;
      const [newQueueCraftItem] = await db
        .insert(queueCraftItemTable)
        .values({
          heroId: hero.id,
          buildingType: craftItem.requiredBuildingType,
          jobId,
          coreMaterialType,
          status: !lastItem ? 'PROGRESS' : 'PENDING',
          craftItemId: craftItem.id,
          completedAt,
        })
        .returning();
      const jobData: QueueCraftItemJob = {
        jobName: 'QUEUE_CRAFT_ITEM',
        payload: {
          heroId: hero.id,
          queueCraftItemId: newQueueCraftItem.id,
          coreMaterialType,
          buildingType: craftItem.requiredBuildingType,
        },
      };
      console.log('@@@@@@@', delay);
      await actionQueue.add(jobName['queue-craft-item'], jobData, {
        delay,
        jobId,
        removeOnComplete: true,
      });

      return c.json<SuccessResponse<QueueCraftItem>>({
        message: 'craft item add to queue',
        success: true,
        data: newQueueCraftItem,
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

      const [hero, queueItems] = await Promise.all([
        heroService(db).getHero(id),
        db.query.queueCraftItemTable.findMany({
          where: eq(queueCraftItemTable.heroId, id),
          with: { craftItem: { with: { gameItem: true } } },
        }),
      ]);

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      if (hero.isInBattle) {
        throw new HTTPException(409, { message: 'Action not allowed: hero now is battle' });
      }

      const deletedItem = queueItems.find((i) => i.id === queueCraftItemId);
      if (!deletedItem) {
        throw new HTTPException(404, { message: 'queue craft item not found' });
      }

      await db.delete(queueCraftItemTable).where(eq(queueCraftItemTable.id, queueCraftItemId));

      await actionQueue.remove(deletedItem.jobId);

      const remaining = queueItems.filter((i) => i.id !== queueCraftItemId);

      const progressJob = remaining.find((i) => i.status === 'PROGRESS');
      const pendingJobs = remaining.filter((i) => i.status === 'PENDING');

      if (!progressJob && pendingJobs.length > 0) {
        const next = await queueCraftItemService(db).setNextQueueCraftItem(hero.id);
        if (next) {
          const updateData: QueueCraftItemSocketData = {
            type: 'QUEUE_CRAFT_ITEM_STATUS_UPDATE',
            payload: {
              queueItemCraftId: next.id,
              status: 'PROGRESS',
              completedAt: next.completedAt,
              buildingType: deletedItem.buildingType,
            },
          };
          io.to(hero.id).emit(socketEvents.queueCraft(), updateData);
        }
      }

      let delayAccumulator = 0;

      if (progressJob) {
        const remainingMs = Math.max(new Date(progressJob.completedAt).getTime() - Date.now(), 0);
        delayAccumulator = remainingMs;
      }

      for (const item of pendingJobs) {
        const requirement = craftItemService(db).getCraftItemRequirement(item.craftItem.gameItem, item.coreMaterialType);
        if (!requirement?.craftTime) {
          console.error('FOR CRAFT ITEM NOT FOUND');
          continue;
        }
        delayAccumulator += requirement.craftTime;

        const job = await actionQueue.getJob(item.jobId);
        if (job) {
          await job.changeDelay(delayAccumulator);
        }
      }

      return c.json<SuccessResponse>({
        message: 'queue craft item deleted',
        success: true,
      });
    },
  )
  .get('/:id/skills', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    const hero = await heroService(db).getHero(id, {
      columns: {
        id: true,
        userId: true,
      },
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

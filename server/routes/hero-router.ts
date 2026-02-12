import {
  BANK_CONTAINER_COST,
  BASE_STATS,
  HP_MULTIPLIER_COST,
  MANA_MULTIPLIER_INT,
  MAX_QUEUE_CRAFT_ITEM,
  RESET_STATS_COST,
} from '@/shared/constants';
import type { WalkMapCompleteData, WalkMapStartData } from '@/shared/socket-data-types';
import { mapTemplate } from '@/shared/templates/map-template';
import { placeTemplate } from '@/shared/templates/place-template';
import { recipeTemplate, recipeTemplateById } from '@/shared/templates/recipe-template';
import { skillsTemplate } from '@/shared/templates/skill-template';
import {
  type BuffInstance,
  type CraftBuildingType,
  type EquipmentSlotType,
  type ErrorResponse,
  type Hero,
  type ItemInstance,
  type PathNode,
  type QueueCraft,
  type StateType,
  type SuccessResponse,
  type THeroRegen,
  type TItemContainer,
  type WeaponHandType,
  buildingValues,
  buyItemsSchema,
  craftBuildingValues,
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
import { db } from '../db/db';
import {
  buffInstanceTable,
  craftRecipeTable,
  heroTable,
  itemContainerTable,
  itemInstanceTable,
  locationTable,
  modifierTable,
  resourceTypeEnum,
  skillInstanceTable,
  slotEnum,
  stateTypeEnum,
} from '../db/schema';
import { queueCraftItemTable } from '../db/schema/queue-craft-item-schema';
import { serverState } from '../game/state/server-state';
import { calculate } from '../lib/calculate';
import { heroOnline } from '../lib/heroOnline';
import { generateRandomUuid, getStateWithCraftBuildingType, verifyHeroOwnership } from '../lib/utils';
import { validateHeroStats } from '../lib/validateHeroStats';
import { loggedIn } from '../middleware/loggedIn';
import { actionQueue } from '../queue/actionQueue';
import { equipmentService } from '../services/equipment-service';
import { heroService } from '../services/hero-service';
import { itemContainerService } from '../services/item-container-service';
import { itemInstanceService } from '../services/item-instance-service';
import { itemTemplateService } from '../services/item-template-service';
import { itemUseService } from '../services/item-use-service';
import { queueCraftService } from '../services/queue-craft-service';
import { skillService } from '../services/skill-service';
import { socketService } from '../services/socket-service';

export const heroRouter = new Hono<Context>()
  .get(
    '/',
    loggedIn,

    async (c) => {
      const userId = c.get('user')?.id as string;
      let heroId = serverState.user.get(userId);

      if (!heroId) {
        const hero = await db.query.heroTable.findFirst({
          where: eq(heroTable.userId, userId),
          with: {
            modifier: true,
            group: true,
            location: true,

            itemContainers: { columns: { id: true, type: true, name: true }, where: eq(itemContainerTable.type, 'BACKPACK') },
          },
        });
        if (!hero) {
          throw new HTTPException(404, {
            message: 'hero not found',
          });
        }
        heroId = hero.id;

        console.log('FETCH HERO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        const equipments = await db.query.itemInstanceTable.findMany({
          where: and(eq(itemInstanceTable.ownerHeroId, hero.id), eq(itemInstanceTable.location, 'EQUIPMENT')),
        });
        const skills = await db.query.skillInstanceTable.findMany({
          where: eq(skillInstanceTable.heroId, hero.id),
        });
        const buffs = await db.query.buffInstanceTable.findMany({
          where: eq(buffInstanceTable.ownerHeroId, hero.id),
        });
        serverState.user.set(userId, hero.id);
        serverState.skill.set(hero.id, skills);
        serverState.buff.set(hero.id, buffs);
        serverState.queueCraft.set(hero.id, []);

        const setData = { ...hero, equipments: equipments ?? [], buffs: [] };
        serverState.hero.set(hero.id, setData as Hero);
        heroOnline(hero.id);
      }

      const stateHero = heroService.getHero(heroId);
      verifyHeroOwnership({ heroUserId: stateHero?.userId, userId });
      stateHero.offlineTimer = undefined;
      stateHero.isOnline = true;
      const { paths, offlineTimer, ...returnData } = stateHero;

      return c.json<SuccessResponse<typeof returnData>>({
        success: true,
        message: 'hero fetched',
        data: returnData,
      });
    },
  )
  .get(
    '/:id/craft-recipe/:buildingType',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string().uuid(),
        buildingType: z.enum(buildingValues),
      }),
    ),

    async (c) => {
      const userId = c.get('user')?.id as string;
      const { id, buildingType } = c.req.valid('param');
      const hero = heroService.getHero(id);
      verifyHeroOwnership({ heroUserId: hero.userId, userId });

      const learnedItemsDb = await db.query.craftRecipeTable.findMany({
        where: eq(craftRecipeTable.heroId, hero.id),
        columns: { recipeId: true },
      });

      const learnedItems = learnedItemsDb.filter((r) => recipeTemplateById[r.recipeId].requirement.building === buildingType);
      const defaultRecipe = recipeTemplate
        .filter((r) => r.defaultUnlocked === true && r.requirement.building === buildingType)
        .map((i) => ({ recipeId: i.id }));

      const mergedRecipe = [...learnedItems, ...defaultRecipe];

      return c.json<SuccessResponse<typeof mergedRecipe>>({
        success: true,
        message: 'craft items fetched',
        data: mergedRecipe,
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
    const regen: THeroRegen = {
      healthAcc: 0,
      manaAcc: 0,
      healthTimeMs: calculate.healthRegenTime(stat.constitution),
      manaTimeMs: calculate.manaRegenTime(stat.wisdom),
    };

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
          maxMana: stat.wisdom * MANA_MULTIPLIER_INT,
          regen,
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
      for (const skill of skillsTemplate) {
        await tx.insert(skillInstanceTable).values({
          heroId: newHero.id,
          skillTemplateId: skill.id,
          expToLvl: skillService.getExpSkillToNextLevel(skill.key, 1),
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
      const hero = heroService.getHero(id);

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
      hero.freeStatPoints = hero.level * 10;
      hero.goldCoins = hero.goldCoins - RESET_STATS_COST;
      hero.stat = BASE_STATS;
      heroService.updateModifier(hero.id);

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

      const hero = heroService.getHero(id);

      validateHeroStats({ freeStatPoints, stat, level: hero.level });

      verifyHeroOwnership({ heroUserId: hero.userId, userId });
      hero.stat = stat;
      hero.freeStatPoints = freeStatPoints;
      heroService.updateModifier(hero.id);

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
      const heroState = heroService.getHero(id);
      let containerState = serverState.container.get(itemContainerId);
      if (!containerState) {
        console.log('FETCH CONTAINER !!!!!!!!!!!');

        const itemContainer = await db.query.itemContainerTable.findFirst({
          where: eq(itemContainerTable.id, itemContainerId),
          with: { itemsInstance: true },
        });
        if (!itemContainer) {
          throw new HTTPException(404, { message: 'itemContainer not found' });
        }

        containerState = itemContainer;

        verifyHeroOwnership({ heroUserId: heroState.userId, userId, containerHeroId: containerState.heroId, heroId: heroState.id });

        serverState.container.set(itemContainer.id, itemContainer);
      }

      return c.json<SuccessResponse<TItemContainer>>({
        message: `container fetched !!!`,
        success: true,
        data: containerState,
      });
    },
  )
  .post(
    '/:id/shop/buy',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator('json', buyItemsSchema),
    async (c) => {
      const userId = c.get('user')?.id as string;
      const { id } = c.req.valid('param');
      const { items } = c.req.valid('json');
      const hero = heroService.getHero(id);
      const backpack = itemContainerService.getBackpack(hero.id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: backpack.heroId, heroId: hero.id });
      const place = placeTemplate.find((p) => p.id === hero.location.placeId);
      if (!place) throw new HTTPException(409, { message: 'Hero not a place' });
      if (!place.buildings.some((b) => b.type === 'MAGIC-SHOP')) {
        throw new HTTPException(409, { message: 'this a not a shop' });
      }

      const { needCapacity, sumPriceGold } = items.reduce(
        (acc, item) => {
          const template = itemTemplateService.getAllItemsTemplateMapIds()[item.id];
          const buyPrice = template.buyPrice ?? 0;
          acc.sumPriceGold += item.quantity * buyPrice;
          if (!template.stackable) {
            acc.needCapacity += item.quantity;
          } else {
            acc.needCapacity += Math.ceil(item.quantity / (template.maxStack ?? 1));
          }
          return acc;
        },
        { sumPriceGold: 0, needCapacity: 0 },
      );
      heroService.checkFreeBackpackCapacity(hero.id, needCapacity);

      heroService.assertHasEnoughGold(hero.id, sumPriceGold);
      const returnData = [];
      for (const item of items) {
        const template = itemTemplateService.getAllItemsTemplateMapIds()[item.id];
        returnData.push({ name: template.name, quantity: item.quantity });
        itemContainerService.createItem({
          heroId: hero.id,
          itemContainerId: backpack.id,
          itemTemplateId: template.id,
          quantity: item.quantity,
          coreResourceId: undefined,
        });
      }
      heroService.spendGold(hero.id, sumPriceGold);

      return c.json<SuccessResponse<typeof returnData>>({
        message: `success buy items`,
        success: true,
        data: returnData,
      });
    },
  )

  .delete(
    '/:id/item-container/:itemContainerId/item/:itemInstanceId',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string().uuid(),
        itemContainerId: z.string().uuid(),
        itemInstanceId: z.string().uuid(),
      }),
    ),

    async (c) => {
      const { id, itemContainerId, itemInstanceId } = c.req.valid('param');
      const userId = c.get('user')?.id as string;
      const hero = heroService.getHero(id);
      const container = itemContainerService.getContainer(itemContainerId);

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: container.heroId, heroId: hero.id });

      const findIndex = container.itemsInstance.findIndex((i) => i.id === itemInstanceId);
      if (findIndex === -1) {
        throw new HTTPException(404, { message: 'item instance not found' });
      }
      const [deletedItem] = container.itemsInstance.splice(findIndex, 1);
      const mapIds = itemTemplateService.getAllItemsTemplateMapIds();
      return c.json<SuccessResponse<{ name: string; quantity: number }>>(
        {
          success: true,
          message: `Success deleted item`,
          data: { name: mapIds[deletedItem.itemTemplateId].name, quantity: deletedItem.quantity },
        },
        201,
      );
    },
  )
  .post(
    '/:id/item/:itemInstanceId/use',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string().uuid(),
        itemInstanceId: z.string().uuid(),
      }),
    ),
    async (c) => {
      const { id, itemInstanceId } = c.req.valid('param');
      const userId = c.get('user')?.id as string;
      const hero = heroService.getHero(id);
      const backpack = itemContainerService.getBackpack(hero.id);
      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: backpack.heroId, heroId: hero.id });

      if (hero.state === 'BATTLE') {
        throw new HTTPException(403, { message: 'You cannot use item during some action.', cause: { canShow: true } });
      }
      const template = itemTemplateService.getAllItemsTemplateMapIds();
      const result = {
        name: '',
        message: '',
      };
      const equipItem = hero.equipments.find((e) => e.id === itemInstanceId);

      if (equipItem) {
        equipmentService.unEquipItem(hero.id, itemInstanceId);
        result.message = 'You have unequipped the item';
        result.name = equipItem.displayName ?? template[equipItem.itemTemplateId].name;
      } else {
        const itemInstance = itemInstanceService.getItemInstance(backpack.id, itemInstanceId);
        switch (template[itemInstance.itemTemplateId].type) {
          case 'POTION': {
            const useResult = itemUseService.drink(hero.id, itemInstanceId);
            result.message = useResult.message;
            result.name = useResult.name;
            break;
          }
          case 'ACCESSORY':
          case 'ARMOR':
          case 'WEAPON':
          case 'SHIELD': {
            equipmentService.equipItem(hero.id, itemInstanceId);
            result.message = 'You have equipped the item';
            result.name = itemInstance.displayName ?? template[itemInstance.itemTemplateId].name;
            break;
          }
        }
      }

      return c.json<SuccessResponse<{ name: string }>>({
        success: true,
        message: result.message,
        data: { name: result.name },
      });
    },
  )
  .post(
    '/:id/item/:itemInstanceId/move',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string().uuid(),
        itemInstanceId: z.string().uuid(),
      }),
    ),
    zValidator(
      'json',
      z.object({
        from: z.string().uuid(),
        to: z.string().uuid(),
      }),
    ),
    async (c) => {
      const { id, itemInstanceId } = c.req.valid('param');
      const { from, to } = c.req.valid('json');

      const userId = c.get('user')?.id as string;
      const hero = heroService.getHero(id);
      const fromContainer = itemContainerService.getContainer(from);
      const itemInstance = itemInstanceService.getItemInstance(from, itemInstanceId);
      const toContainer = itemContainerService.getContainer(to);
      const itemTemplate = itemTemplateService.getAllItemsTemplateMapIds()[itemInstance.itemTemplateId];
      for (const container of [fromContainer, toContainer]) {
        verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: container.heroId, heroId: hero.id });
      }

      if (hero.state === 'BATTLE') {
        throw new HTTPException(403, { message: 'You cannot use item during some action.', cause: { canShow: true } });
      }

      itemContainerService.checkFreeContainerCapacity(toContainer.id);

      const existContainer = toContainer.itemsInstance.some((i) => i.itemTemplateId === itemTemplate.id);

      if ((!existContainer && itemTemplate.stackable) || !itemTemplate.stackable) {
        itemInstance.itemContainerId = to;
        itemInstance.location = toContainer.type;
        itemInstance.ownerHeroId = hero.id;
        itemContainerService.removeItem(from, itemInstanceId);
        toContainer.itemsInstance.push(itemInstance);
      } else {
        itemContainerService.removeItem(from, itemInstanceId);
        itemContainerService.obtainStackableItem({
          heroId: hero.id,
          itemContainerId: toContainer.id,
          itemTemplateId: itemTemplate.id,
          location: toContainer.type,
          quantity: itemInstance.quantity,
        });
      }

      return c.json<SuccessResponse>({
        success: true,
        message: 'success move item',
      });
    },
  )
  .get('/:id/buffs', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const userId = c.get('user')?.id;
    const { id } = c.req.valid('param');
    const hero = heroService.getHero(id);
    verifyHeroOwnership({ heroUserId: hero.userId, userId });

    let buffs = serverState.buff.get(hero.id);
    if (!buffs) {
      console.log('FETCH BUFFS!!!!!');
      const buffsDb = await db.query.buffInstanceTable.findMany({
        where: eq(buffInstanceTable.ownerHeroId, hero.id),
      });
      buffs = buffsDb;
      serverState.buff.set(hero.id, buffsDb);
    }

    return c.json<SuccessResponse<typeof buffs>>({
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
      const heroState = heroService.getHero(id);

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
        mapId: heroState.location.mapId!,
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
      const lastItem = walkPathWithTime.at(-1);
      return c.json<SuccessResponse<{ finishWalkTime: number | undefined }>>({
        message: 'walking start',
        success: true,
        data: { finishWalkTime: lastItem?.completedAt },
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
      const heroState = heroService.getHero(id);
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
    '/:id/action/travel',
    loggedIn,
    zValidator('param', z.object({ id: z.string().uuid() })),
    zValidator('json', z.object({ placeId: z.string().uuid().optional(), entranceId: z.string().uuid().optional() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const { entranceId, placeId } = c.req.valid('json');

      const hero = heroService.getHero(id);
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      if (hero.state !== 'IDLE') {
        throw new HTTPException(409, {
          message: 'Hero is currently busy with another action',
        });
      }
      const heroPosX = hero.location.x;
      const heroPosY = hero.location.y;

      if (placeId) {
        const place = placeTemplate.find((p) => p.id === placeId);
        if (!place) {
          throw new HTTPException(404, {
            message: 'place not found',
          });
        }
        if (place.mapId !== hero.location.mapId) {
          throw new HTTPException(404, {
            message: 'Hero is not located on this map ',
          });
        }
        if (place.x !== heroPosX && place.y !== heroPosY) {
          throw new HTTPException(404, {
            message: 'Hero must be at the place entrance to enter',
          });
        }
        await db
          .update(locationTable)
          .set({
            mapId: null,
            placeId: place.id,
          })
          .where(eq(locationTable.heroId, id));

        hero.location.mapId = null;
        hero.location.placeId = place.id;

        socketService.sendMapRemoveHero(hero.id, place.mapId);
        socketService.sendPlaceAddHero(hero.id, place.id);
        socketService.sendToClientSysMessage(hero.id, { type: 'WARNING', text: `Success enter to ${place.name}` });
      }

      if (entranceId) {
        if (hero.location.placeId) {
          const place = placeTemplate.find((p) => p.id === hero.location.placeId);
          if (!place) {
            throw new HTTPException(404, {
              message: 'place not found',
            });
          }
          const entrance = place.entrances.find((e) => e.id === entranceId);
          if (!entrance) {
            throw new HTTPException(404, {
              message: 'entrance not found',
            });
          }
          hero.location.mapId = entrance.targetMapId;
          hero.location.placeId = null;
          hero.location.x = entrance.targetX;
          hero.location.y = entrance.targetY;
          socketService.sendPlaceRemoveHero(hero.id, place.id);
          socketService.sendMapAddHero(hero.id, entrance.targetMapId);
        } else {
          const map = mapTemplate.find((m) => m.id === hero.location.mapId);
          if (!map) {
            throw new HTTPException(404, {
              message: 'map not found',
            });
          }
          const entrance = map.entrances.find((e) => e.id === entranceId);
          if (!entrance) {
            throw new HTTPException(404, {
              message: 'entrance not found',
            });
          }
          if (entrance.x !== heroPosX && entrance.y !== heroPosY) {
            throw new HTTPException(404, {
              message: 'Hero must be at the  entrance to enter',
            });
          }
          if (entrance.targetPlaceId) {
            hero.location.mapId = null;
            const place = placeTemplate.find((p) => p.id === entrance.targetPlaceId);
            hero.location.placeId = entrance.targetPlaceId;
            if (!place) {
              throw new HTTPException(404, {
                message: 'place not found',
              });
            }
            hero.location.x = entrance.targetX ?? 0;
            hero.location.y = entrance.targetY ?? 0;
            socketService.sendMapRemoveHero(hero.id, map.id);
            socketService.sendPlaceAddHero(hero.id, entrance.targetPlaceId);
            socketService.sendToClientSysMessage(hero.id, { type: 'WARNING', text: `Success enter to ${place.name}` });
          }
          if (entrance.targetMapId) {
            hero.location.mapId = entrance.targetMapId;
            hero.location.x = entrance.targetX ?? 0;
            hero.location.y = entrance.targetY ?? 0;
            hero.location.placeId = null;
            socketService.sendMapRemoveHero(hero.id, map.id);
            socketService.sendMapAddHero(hero.id, entrance.targetMapId);
          }
        }
      }

      return c.json<SuccessResponse>({
        message: 'travel success',
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

      const hero = heroService.getHero(id);

      if (hero.state !== 'IDLE') {
        throw new HTTPException(409, {
          message: 'Hero is currently busy with another action',
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      const place = placeTemplate.find((p) => p.id === hero.location.placeId);
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
      hero.location.mapId = place.mapId;
      hero.location.placeId = null;
      hero.location.x = place.x;
      hero.location.y = place.y;

      socketService.sendPlaceRemoveHero(hero.id, place.id);
      socketService.sendMapAddHero(hero.id, place.mapId);

      return c.json<SuccessResponse>({
        message: 'leave place success ',
        success: true,
      });
    },
  )

  .get(
    '/:id/queue-craft',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const hero = heroService.getHero(id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      const queueCraftItems = queueCraftService.getQueueCraft(hero.id);

      return c.json<SuccessResponse<QueueCraft[]>>({
        message: 'craft item add to queue',
        success: true,
        data: queueCraftItems,
      });
    },
  )
  .post(
    '/:id/queue-craft/add',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'json',
      z.object({
        coreResourceId: z.optional(z.string().uuid()),
        recipeId: z.string().uuid(),
      }),
    ),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const { recipeId, coreResourceId } = c.req.valid('json');
      const hero = heroService.getHero(id);
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });
      const queueCraft = queueCraftService.getQueueCraft(hero.id);

      const recipe = recipeTemplateById[recipeId];
      const itemTemplate = itemTemplateService.getAllItemsTemplateMapIds()[recipe.itemTemplateId];
      const last = queueCraft.at(-1);
      if (last && last.craftBuildingType !== recipe.requirement.building) {
        throw new HTTPException(400, {
          message: 'You must work only one building',
          cause: { canShow: true },
        });
      }
      if (queueCraft.length >= MAX_QUEUE_CRAFT_ITEM) {
        throw new HTTPException(400, {
          message: 'You cannot queue more than 4 craft items.',
          cause: { canShow: true },
        });
      }

      queueCraftService.canStartCraft(hero.id, coreResourceId, recipeId);
      const now = Date.now();
      if (!queueCraft.length) {
        queueCraft.push({
          id: generateRandomUuid(),
          recipeId,
          coreResourceId: recipe.requirement.coreResource ? coreResourceId : undefined,
          expiresAt: now + recipe.timeMs,
          craftBuildingType: recipe.requirement.building,
          status: 'PROGRESS',
        });
        const stateData = getStateWithCraftBuildingType(recipe.requirement.building);
        hero.state = stateData;
        socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, stateData);
      } else {
        const last = queueCraft.at(-1)?.expiresAt;
        queueCraft.push({
          id: generateRandomUuid(),
          recipeId,
          coreResourceId: recipe.requirement.coreResource ? coreResourceId : undefined,
          expiresAt: now + Math.max((last ?? 0) - now, 0) + recipe.timeMs,
          craftBuildingType: recipe.requirement.building,
          status: 'PENDING',
        });
      }

      return c.json<SuccessResponse<QueueCraft[]>>({
        message: 'craft item add to queue',
        success: true,
        data: queueCraft,
      });
    },
  )
  .delete(
    '/:id/queue-craft/:queueCraftItemId',
    loggedIn,
    zValidator('param', z.object({ id: z.string(), queueCraftItemId: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id, queueCraftItemId } = c.req.valid('param');
      const hero = heroService.getHero(id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });
      const queueCraft = queueCraftService.getQueueCraft(hero.id);
      const findIndex = queueCraft.findIndex((q) => q.id === queueCraftItemId);

      if (findIndex === -1) throw new HTTPException(404, { message: 'queueCraft findIndex not found' });
      const [deletedItem] = queueCraft.splice(findIndex, 1);
      const next = queueCraft.at(0);
      const now = Date.now();
      if (deletedItem.status === 'PROGRESS') {
        let acc = 0;
        for (const queue of queueCraft) {
          acc += recipeTemplateById[queue.recipeId].timeMs;
          queue.expiresAt = now + acc;
        }
        if (next) {
          queueCraftService.setNextQueue(hero.id, next.id, recipeTemplateById[next.recipeId].timeMs);
        }
      } else {
        let acc = 0;
        for (const queue of queueCraft) {
          if (queue.status === 'PROGRESS') {
            acc = queue.expiresAt - now;
            continue;
          }
          acc += recipeTemplateById[queue.recipeId].timeMs;
          queue.expiresAt = now + acc;
        }
      }
      if (!queueCraft.length) {
        socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, 'IDLE');
        hero.state = 'IDLE';
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

    const hero = heroService.getHero(id);
    let skills = serverState.skill.get(hero.id);
    if (!skills) {
      console.log('FETCH SKILLS!!!!!');
      const skillsDb = await db.query.skillInstanceTable.findMany({
        where: eq(skillInstanceTable.heroId, hero.id),
      });
      skills = skillsDb;
      serverState.skill.set(hero.id, skillsDb);
    }

    verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

    return c.json<SuccessResponse<typeof skills>>({
      message: 'skills fetched',
      success: true,
      data: skills,
    });
  })
  .get('/:id/item-container', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');
    const hero = heroService.getHero(id);

    const itemContainers = await db.query.itemContainerTable.findMany({
      where: and(eq(itemContainerTable.heroId, hero.id), eq(itemContainerTable.placeId, hero.location?.placeId!)),

      orderBy: asc(itemContainerTable.createdAt),
    });

    verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

    return c.json<SuccessResponse<typeof itemContainers>>({
      message: 'bank containers fetched',
      success: true,
      data: itemContainers,
    });
  })
  .post('/:id/item-container/create', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    const hero = heroService.getHero(id);

    const count = await db.$count(itemContainerTable, and(eq(itemContainerTable.heroId, hero.id), eq(itemContainerTable.type, 'BANK')));
    verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

    const newPremiumCoinsValue = await db.transaction(async (tx) => {
      heroService.spendPremCoin(hero.id, BANK_CONTAINER_COST);

      await tx.insert(itemContainerTable).values({
        heroId: hero.id,
        placeId: hero.location?.placeId,
        type: 'BANK',
        name: `${count + 1}`,
      });
      const [{ premiumCoins }] = await db
        .update(heroTable)
        .set({
          premiumCoins: hero.premiumCoins - BANK_CONTAINER_COST,
        })
        .where(eq(heroTable.id, hero.id))
        .returning({ premiumCoins: heroTable.premiumCoins });

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
      const hero = heroService.getHero(id);
      const itemContainer = itemContainerService.getContainer(itemContainerId);
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

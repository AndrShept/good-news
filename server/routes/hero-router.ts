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
import { mapTemplate } from '@/shared/templates/map-template';
import { placeTemplate } from '@/shared/templates/place-template';
import { recipeTemplate, recipeTemplateById } from '@/shared/templates/recipe-template';
import { skillsTemplate } from '@/shared/templates/skill-template';
import {
  type BuffInstance,
  type EquipmentSlotType,
  type ErrorResponse,
  type Hero,
  type ItemInstance,
  type PathNode,
  type QueueCraftItem,
  type SuccessResponse,
  type THeroRegen,
  type TItemContainer,
  type WeaponHandType,
  buildingValues,
  buyItemsSchema,
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
  coreMaterialTypeEnum,
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
import { generateRandomUuid, verifyHeroOwnership } from '../lib/utils';
import { validateHeroStats } from '../lib/validateHeroStats';
import { loggedIn } from '../middleware/loggedIn';
import { actionQueue } from '../queue/actionQueue';
import { equipmentService } from '../services/equipment-service';
import { heroService } from '../services/hero-service';
import { itemContainerService } from '../services/item-container-service';
import { itemInstanceService } from '../services/item-instance-service';
import { itemTemplateService } from '../services/item-template-service';
import { itemUseService } from '../services/item-use-service';

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
        serverState.user.set(userId, hero.id);

        const setData = { ...hero, equipments: equipments ?? [], buffs: [] };
        serverState.hero.set(hero.id, setData as Hero);
        heroService.updateRegenTime(hero.id)
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
      healthTimeMs: 0,
      manaTimeMs: 0,
      lastUpdate: Date.now()
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
          regen
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

      const itemTemlateById = itemTemplateService.getAllItemsTemplateMapIds();
      const { needCapacity, sumPriceGold } = items.reduce(
        (acc, item) => {
          const tempalte = itemTemlateById[item.id];
          const buyPrice = tempalte.buyPrice ?? 0;
          acc.sumPriceGold += item.quantity * buyPrice;
          if (!tempalte.stackable) {
            acc.needCapacity += item.quantity;
          } else {
            acc.needCapacity += Math.ceil(item.quantity / (tempalte.maxStack ?? 1));
          }
          return acc;
        },
        { sumPriceGold: 0, needCapacity: 0 },
      );
      heroService.checkFreeBackpackCapacity(hero.id, needCapacity);

      heroService.assertHasEnoughGold(hero.id, sumPriceGold);
      const returnData = [];
      for (const item of items) {
        const template = itemTemlateById[item.id];
        returnData.push({ name: template.name, quantity: item.quantity });
        itemContainerService.obtainItem({
          heroId: hero.id,
          itemContainerId: backpack.id,
          itemTemplateId: template.id,
          quantity: item.quantity,
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
        result.name = template[equipItem.itemTemplateId].name;
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
            result.name = template[itemInstance.itemTemplateId].name;
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
    '/:id/action/enter-place',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');

      const heroState = heroService.getHero(id);
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

      const heroState = heroService.getHero(id);
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

  .put(
    '/:id/state',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),
    zValidator('json', z.object({ type: z.enum(stateTypeEnum.enumValues) })),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const { type } = c.req.valid('json');

      const hero = heroService.getHero(id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      hero.state = type;

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
      const hero = heroService.getHero(id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      return c.json<SuccessResponse<QueueCraftItem[]>>({
        message: 'craft item add to queue',
        success: true,
        // data: queueCraftItems,
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
        coreMaterialType: z.optional(z.string()),
        buildingType: z.enum(buildingValues),
        craftItemId: z.string(),
      }),
    ),

    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      // const { craftItemId, coreMaterialType, buildingType } = c.req.valid('json');
      // const hero = serverState.getHeroState(id);
      // const [craftItem, coreMaterial, backpack] = await Promise.all([itemContainerService(db).getHeroBackpack(id)]);
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

      // return c.json<SuccessResponse<QueueCraftItem>>({
      //   message: 'craft item add to queue',
      //   success: true,
      //   data: newQueueCraftItem,
      // });
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

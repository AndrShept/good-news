import {
  BANK_CONTAINER_COST,
  BASE_GATHERING_TIME,
  BASE_STATS,
  HP_MULTIPLIER_COST,
  MANA_MULTIPLIER_INT,
  MAX_QUEUE_CRAFT_ITEM,
  RESET_STATS_COST,
  WORLD_SEED,
} from '@/shared/constants';
import type { HeroUpdateEvent, MapChunkUpdateEntitiesData } from '@/shared/socket-data-types';
import { NPC_SHOP_TABLE } from '@/shared/table/npc-shop-table';
import { mapTemplate } from '@/shared/templates/map-template';
import { placeTemplate } from '@/shared/templates/place-template';
import { recipeTemplate, recipeTemplateById } from '@/shared/templates/recipe-template';
import { resourceTemplateById } from '@/shared/templates/resource-template';
import { gatheringSkillKeysValues, skillsTemplate } from '@/shared/templates/skill-template';
import { toolTemplateByKey } from '@/shared/templates/tool-template';
import {
  type ErrorResponse,
  type Hero,
  type ItemInstance,
  type ItemsInstanceDeltaEvent,
  type PathNode,
  type QueueCraft,
  type StateType,
  type SuccessResponse,
  type THeroRegen,
  type TItemContainer,
  type WeaponHandType,
  buildingValues,
  buyItemsSchema,
  createHeroSchema,
  refiningBuildingValues,
  statsSchema,
} from '@/shared/types';
import {
  buildPathWithObstacles,
  getHeroStateWithGatherSkillKey,
  getMapLayerNameAtHeroPos,
  getStateWithCraftBuildingType,
  getStateWithRefiningBuildingKey,
  getTilesAroundHero,
  itemRefineableForBuilding,
} from '@/shared/utils';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, lt, lte, ne, sql } from 'drizzle-orm';
import { PgTimestampStringBuilder } from 'drizzle-orm/pg-core';
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
  modifierTable,
  resourceTypeEnum,
  skillInstanceTable,
  slotEnum,
  stateTypeEnum,
} from '../db/schema';
import { queueCraftItemTable } from '../db/schema/queue-craft-item-schema';
import { type HeroRuntime, type TileState, serverState } from '../game/state/server-state';
import { calculate } from '../lib/calculate';
import { heroOnline } from '../lib/heroOnline';
import { generateRandomUuid, verifyHeroOwnership } from '../lib/utils';
import { validateHeroStats } from '../lib/validateHeroStats';
import { loggedIn } from '../middleware/loggedIn';
import { actionQueue } from '../queue/actionQueue';
import { deltaEventsService } from '../services/delta-events-service';
import { equipmentService } from '../services/equipment-service';
import { gatheringService } from '../services/gathering-service';
import { heroService } from '../services/hero-service';
import { itemConsumeService } from '../services/item-consume-service';
import { itemContainerService } from '../services/item-container-service';
import { itemInstanceService } from '../services/item-instance-service';
import { itemTemplateService } from '../services/item-template-service';
import { mapService } from '../services/map-service';
import { npcService } from '../services/npc-service';
import { queueCraftService } from '../services/queue-craft-service';
import { refiningService } from '../services/refining-service';
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

            itemContainers: { columns: { id: true, type: true, name: true }, where: eq(itemContainerTable.type, 'BACKPACK') },
          },
        });
        if (!hero) {
          throw new HTTPException(404, {
            message: 'hero not found',
          });
        }
        heroId = hero.id;
        console.log('FETCH HERO');
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

        serverState.hero.set(hero.id, {
          ...hero,
          equipments: equipments ?? [],
          buffs: [],
          location: { ...hero.location, targetX: null, targetY: null },
          regen: {
            healthAcc: 0,
            healthTimeMs: 0,
            manaAcc: 0,
            manaTimeMs: 0,
          },
        } as HeroRuntime);
        heroOnline(hero.id);
        heroService.updateModifier(heroId);
      }

      const stateHero = heroService.getHero(heroId);
      verifyHeroOwnership({ heroUserId: stateHero?.userId, userId });
      stateHero.offlineTimer = undefined;
      const { paths, offlineTimer, selectedGatherTile, ...returnData } = stateHero;

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

      const learnedItems = learnedItemsDb.filter((r) => recipeTemplateById[r.recipeId].requirement.buildingCraftLocation === buildingType);
      const defaultRecipe = recipeTemplate
        .filter((r) => r.defaultUnlocked === true && r.requirement.buildingCraftLocation === buildingType)
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
          location: {
            placeId: place.id,
            x: place.x,
            y: place.y,
            chunkId: null,
            mapId: null,
            targetX: null,
            targetY: null,
          },
        })
        .returning();
      await tx.insert(modifierTable).values({
        id: generateRandomUuid(),
        heroId: newHero.id,
      });

      await tx.insert(itemContainerTable).values({
        name: 'Main Backpack',
        type: 'BACKPACK',
        ownerId: newHero.id,
      });

      await itemContainerService.createPlaceContainers(tx, place.id, newHero.id);

      for (const skill of skillsTemplate) {
        await tx.insert(skillInstanceTable).values({
          heroId: newHero.id,
          skillTemplateId: skill.id,
          level: 0,
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

        verifyHeroOwnership({ heroUserId: heroState.userId, userId, containerHeroId: containerState.ownerId, heroId: heroState.id });

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
    '/:id/npc/:npcId/shop/:action',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string().uuid(),
        npcId: z.string().uuid(),
        action: z.enum(['buy', 'sell']),
      }),
    ),
    zValidator('json', buyItemsSchema),
    async (c) => {
      const userId = c.get('user')?.id as string;
      const { id, action, npcId } = c.req.valid('param');
      const { items } = c.req.valid('json');
      const hero = heroService.getHero(id);
      const backpack = itemContainerService.getBackpack(hero.id);

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: backpack.ownerId, heroId: hero.id });
      const place = placeTemplate.find((p) => p.id === hero.location.placeId);
      if (!place) throw new HTTPException(409, { message: 'Hero not a place' });
      const npc = npcService.getNpc(npcId);
      const npcExistInPlace = (place.npcIds as string[]).includes(npc.id);
      if (!npcExistInPlace) throw new HTTPException(409, { message: 'npc  not a place' });
      let returnData = {
        goldCoins: 0,
        itemsDelta: [] as ItemsInstanceDeltaEvent[],
        messageData: [] as { name: string; quantity: number }[],
      };
      switch (action) {
        case 'buy': {
          const { itemsDelta, messageData } = npcService.buyItems({
            backpackId: backpack.id,
            heroId: hero.id,
            npcId: npc.id,
            items,
          });
          returnData.itemsDelta = itemsDelta;
          returnData.messageData = messageData;
          break;
        }
        case 'sell':
          const { itemsDelta, messageData } = npcService.sellItems({
            backpackId: backpack.id,
            heroId: hero.id,
            npcId: npc.id,
            items,
          });
          returnData.itemsDelta = itemsDelta;
          returnData.messageData = messageData;
          break;
      }
      returnData.goldCoins = hero.goldCoins;
      return c.json<SuccessResponse<typeof returnData>>({
        message: `You have successfully ${action === 'buy' ? 'purchased' : 'sell'} the items.`,
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

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: container.ownerId, heroId: hero.id });

      const findIndex = container.itemsInstance.findIndex((i) => i.id === itemInstanceId);
      if (findIndex === -1) {
        throw new HTTPException(404, { message: 'item instance not found' });
      }
      const [deletedItem] = container.itemsInstance.splice(findIndex, 1);
      const mapIds = itemTemplateService.getAllItemsTemplateMapIds();
      deltaEventsService.itemInstance.delete(itemInstanceId);

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
    '/:id/equipment/:itemInstanceId',
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
      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: backpack.ownerId, heroId: hero.id });

      if (hero.state !== 'IDLE') {
        throw new HTTPException(403, { message: 'You cannot use item during some action.', cause: { canShow: true } });
      }
      let message: null | string = null;
      const equipItem = hero.equipments.find((e) => e.id === itemInstanceId);
      let itemsDelta: ItemsInstanceDeltaEvent[] = [];

      if (equipItem) {
        itemsDelta = equipmentService.unEquipItem(hero.id, itemInstanceId);
      } else {
        itemsDelta = equipmentService.equipItem(hero.id, itemInstanceId);
        message = 'You have equipped the item';
      }

      const returnData = {
        hero: {
          currentHealth: hero.currentHealth,
          currentMana: hero.currentMana,
          maxHealth: hero.maxHealth,
          maxMana: hero.maxMana,
          stat: hero.stat,
          regen: hero.regen,
          modifier: hero.modifier,
        },
        itemsDelta,
      };

      return c.json<SuccessResponse<typeof returnData>>({
        success: true,
        message: message ?? 'OK',
        data: returnData,
      });
    },
  )
  .post(
    '/:id/item/:itemInstanceId/consume',
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
      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: backpack.ownerId, heroId: hero.id });

      if (hero.state !== 'IDLE') {
        throw new HTTPException(403, { message: 'You cannot use item during some action.', cause: { canShow: true } });
      }

      const template = itemTemplateService.getAllItemsTemplateMapIds();

      let result: ReturnType<typeof itemConsumeService.drink> | undefined | null = null;

      const itemInstance = itemInstanceService.getItemInstance(backpack.id, itemInstanceId);
      switch (template[itemInstance.itemTemplateId].type) {
        case 'POTION': {
          result = itemConsumeService.drink(hero.id, itemInstanceId);
          break;
        }
        case 'SKILL_BOOK':
          result = itemConsumeService.readSkillBook(hero.id, itemInstanceId);
          break;

        default:
          throw new HTTPException(400, { message: 'Invalid item type for equipping' });
      }

      const returnData = {
        ...result,
        hero: {
          currentHealth: hero.currentHealth,
          currentMana: hero.currentMana,
          maxHealth: hero.maxHealth,
          maxMana: hero.maxMana,
          stat: hero.stat,
          regen: hero.regen,
          modifier: hero.modifier,
        },
      };
      return c.json<SuccessResponse<typeof returnData>>({
        success: true,
        message: 'success consume item',
        data: returnData,
      });
    },
  )
  .post(
    '/:id/item/:itemInstanceId/split',
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
        itemContainerId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    ),
    async (c) => {
      const { id, itemInstanceId } = c.req.valid('param');
      const { itemContainerId, quantity } = c.req.valid('json');
      const userId = c.get('user')?.id as string;
      const hero = heroService.getHero(id);
      const itemContainer = itemContainerService.getContainer(itemContainerId);
      const itemInstance = itemInstanceService.getItemInstance(itemContainerId, itemInstanceId);

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: itemContainer.ownerId, heroId: hero.id });
      if (itemInstance.quantity === 1 || itemInstance.quantity === quantity) {
        throw new HTTPException(400, { message: 'Quantity must be less than available amount' });
      }

      if (itemInstance.itemContainerId !== itemContainerId) {
        throw new HTTPException(404, { message: 'Item does not belong to the specified container' });
      }
      if (hero.state !== 'IDLE') {
        throw new HTTPException(403, { message: 'You cannot use item during some action.', cause: { canShow: true } });
      }
      let itemsDelta: ItemsInstanceDeltaEvent[] = [];

      itemsDelta = itemContainerService.consumeItem({
        itemContainerId,
        itemInstanceId,
        quantity,
        mode: 'use',
      });

      const newItem = itemInstanceService.createItem({
        heroId: id,
        itemContainerId,
        itemTemplateId: itemInstance.itemTemplateId,
        quantity,
        location: itemInstance.location,
        coreResourceId: undefined,
        isAddPendingEvents: true,
      });
      itemsDelta.push({ type: 'CREATE', itemContainerId, item: newItem });

      const returnData = {
        itemsDelta,
      };

      return c.json<SuccessResponse<typeof returnData>>({
        success: true,
        message: 'success split item',
        data: returnData,
      });
    },
  )
  .post(
    '/:id/item/stack',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string().uuid(),
      }),
    ),
    zValidator(
      'json',
      z.object({
        fromItemInstanceId: z.string().uuid(),
        toItemInstanceId: z.string().uuid(),
        itemContainerId: z.string().uuid(),
      }),
    ),

    async (c) => {
      const { id } = c.req.valid('param');
      const { fromItemInstanceId, toItemInstanceId, itemContainerId } = c.req.valid('json');
      const userId = c.get('user')?.id as string;
      const hero = heroService.getHero(id);
      const itemContainer = itemContainerService.getContainer(itemContainerId);
      const fromItemInstance = itemInstanceService.getItemInstance(itemContainerId, fromItemInstanceId);
      const toItemInstance = itemInstanceService.getItemInstance(itemContainerId, toItemInstanceId);

      verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: itemContainer.ownerId, heroId: hero.id });

      const toItemTemplate = itemTemplateService.getTemplateByItemTemplateId(toItemInstance.itemTemplateId);
      const fromItemTemplate = itemTemplateService.getTemplateByItemTemplateId(fromItemInstance.itemTemplateId);
      if (fromItemInstance.quantity >= (fromItemTemplate.maxStack ?? 1) || toItemInstance.quantity >= (toItemTemplate.maxStack ?? 1)) {
        throw new HTTPException(400, { message: 'Quantity must be less than available amount' });
      }
      if (fromItemInstance.id === toItemInstance.id) {
        throw new HTTPException(400, { message: 'Item does not stack your self' });
      }

      if (fromItemInstance.itemContainerId !== itemContainerId || toItemInstance.itemContainerId !== itemContainerId) {
        throw new HTTPException(404, { message: 'Item does not belong to the specified container' });
      }
      if (hero.state !== 'IDLE') {
        throw new HTTPException(403, { message: 'You cannot use item during some action.', cause: { canShow: true } });
      }
      let itemsDelta: ItemsInstanceDeltaEvent[] = [];
      const space = (toItemTemplate.maxStack ?? 1) - toItemInstance.quantity;
      const quantity = Math.min(space, fromItemInstance.quantity);
      itemsDelta = itemContainerService.consumeItem({
        itemContainerId,
        itemInstanceId: fromItemInstance.id,
        quantity,
        mode: 'use',
      });
      const obtainItemsDelta = itemContainerService.obtainStackableItem({
        heroId: id,
        itemContainerId,
        itemTemplateId: toItemInstance.itemTemplateId,
        location: toItemInstance.location,
        quantity,
        targetItemInstanceId: toItemInstance.id,
      });

      itemsDelta.push(...obtainItemsDelta);
      const returnData = {
        itemsDelta,
      };

      return c.json<SuccessResponse<typeof returnData>>({
        success: true,
        message: 'success stack item',
        data: returnData,
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
        verifyHeroOwnership({ heroUserId: hero.userId, userId, containerHeroId: container.ownerId, heroId: hero.id });
      }

      if (hero.state !== 'IDLE') {
        throw new HTTPException(403, { message: 'You cannot use item during some action.', cause: { canShow: true } });
      }

      itemContainerService.checkFreeContainerCapacity(toContainer.id);

      const existContainer = toContainer.itemsInstance.some((i) => i.itemTemplateId === itemTemplate.id);
      let inventoryDeltas: ItemsInstanceDeltaEvent[] = [];
      if ((!existContainer && itemTemplate.stackable) || !itemTemplate.stackable) {
        itemInstance.itemContainerId = to;
        itemInstance.location = toContainer.type;
        itemInstance.ownerHeroId = hero.id;
        itemContainerService.deleteItem(from, itemInstanceId);
        toContainer.itemsInstance.push(itemInstance);
        inventoryDeltas.push({ type: 'CREATE', itemContainerId: toContainer.id, item: itemInstance });
        deltaEventsService.itemInstance.update(itemInstanceId, {
          itemContainerId: toContainer.id,
          ownerHeroId: toContainer.ownerId,
          location: toContainer.type,
        });
      } else {
        itemContainerService.deleteItem(from, itemInstanceId);
        deltaEventsService.itemInstance.delete(itemInstanceId);

        inventoryDeltas = itemContainerService.obtainStackableItem({
          heroId: hero.id,
          itemContainerId: toContainer.id,
          itemTemplateId: itemTemplate.id,
          location: toContainer.type,
          quantity: itemInstance.quantity,
        });
      }

      return c.json<SuccessResponse<{ inventoryDeltas: typeof inventoryDeltas }>>({
        success: true,
        message: 'success move item',
        data: { inventoryDeltas },
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

      // const savePosQueue = serverState.pathPersistQueue.get(id);
      // if (savePosQueue) {
      //   serverState.pathPersistQueue.delete(id);
      // }

      heroState.paths = walkPathWithTime;
      heroState.state = 'WALK';
      heroState.location.targetX = targetPos.x;
      heroState.location.targetY = targetPos.y;

      const socketData: MapChunkUpdateEntitiesData = {
        entityId: heroState.id,
        data: {
          type: 'HERO',
          payload: { state: 'WALK' },
        },
      };
      io.to(heroState.location.chunkId!).emit(socketEvents.entityUpdate(), socketData);
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
      const hero = heroService.getHero(id);
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      // serverState.pathPersistQueue.set(id, { x: hero.location.x, y: hero.location.y });
      hero.paths = [];
      hero.state = 'IDLE';
      hero.location.targetX = null;
      hero.location.targetY = null;
      const chunkId = mapService.getChunkId({ x: hero.location.x, y: hero.location.y, mapId: hero.location.mapId! });
      socketService.sendMapChunkMoveFinish(hero.id, chunkId);

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

        await db.transaction(async (tx) => {
          await itemContainerService.createPlaceContainers(tx, place.id, hero.id);
        });

        const socket = socketService.getSocket(hero.id);
        const chunksIds = mapService.getAroundChunkIds({ x: hero.location.x, y: hero.location.y, mapId: hero.location.mapId });
        for (const chunkId of chunksIds) {
          socket.leave(chunkId);
        }

        hero.location.mapId = null;
        hero.location.chunkId = null;
        hero.location.placeId = place.id;

        mapService.despawnMapEntitiesInChunk({ entityId: hero.id, type: 'HERO', mapId: place.mapId, x: place.x, y: place.y });
        socketService.sendPlaceAddHero(hero.id, place.id);
        socketService.sendToClientSysMessage(hero.id, { color: 'GREY', text: `You have entered ${place.name}.` });
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
          // socketService.sendMapAddHero(hero.id, entrance.targetMapId);
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
            // socketService.sendMapRemoveHero(hero.id, map.id);
            socketService.sendPlaceAddHero(hero.id, entrance.targetPlaceId);
            socketService.sendToClientSysMessage(hero.id, { color: 'GREY', text: `You have entered ${place.name}.` });
          }
          if (entrance.targetMapId) {
            hero.location.mapId = entrance.targetMapId;
            hero.location.x = entrance.targetX ?? 0;
            hero.location.y = entrance.targetY ?? 0;
            hero.location.placeId = null;
            // socketService.sendMapRemoveHero(hero.id, map.id);
            // socketService.sendMapAddHero(hero.id, entrance.targetMapId);
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

    (c) => {
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
      const chunkId = mapService.getChunkId({
        x: place.x,
        y: place.y,
        mapId: place.mapId,
      });

      hero.location.chunkId = chunkId;
      hero.location.mapId = place.mapId;
      hero.location.placeId = null;
      hero.location.x = place.x;
      hero.location.y = place.y;

      socketService.sendPlaceRemoveHero(hero.id, place.id);
      const socket = socketService.getSocket(hero.id);
      const chunksIds = mapService.getAroundChunkIds({ x: hero.location.x, y: hero.location.y, mapId: hero.location.mapId });
      for (const chunkId of chunksIds) {
        socket.join(chunkId);
      }

      mapService.spawnMapEntitiesInChunk({
        type: 'HERO',
        entityId: hero.id,
        x: hero.location.x,
        y: hero.location.y,
        mapId: hero.location.mapId,
      });
      socketService.sendMapChunkSpawnEntities({ chunkId, entityIds: [hero.id], type: 'HERO' });

      const returnData = hero.location;

      return c.json<SuccessResponse<typeof returnData>>({
        message: 'leave place success ',
        success: true,
        data: returnData,
      });
    },
  )
  .post(
    '/:id/action/gather/:gatherSkill',
    loggedIn,
    zValidator('param', z.object({ id: z.string(), gatherSkill: z.enum(gatheringSkillKeysValues) })),

    async (c) => {
      const user = c.get('user');
      const { id, gatherSkill } = c.req.valid('param');
      const hero = heroService.getHero(id);

      if (hero.state !== 'IDLE') {
        throw new HTTPException(409, {
          message: 'Hero is currently busy with another action',
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });
      gatheringService.canStartGathering(hero.id, gatherSkill);
      gatheringService.setGatherTileOnMap(hero.id, gatherSkill);
      const state = getHeroStateWithGatherSkillKey(gatherSkill);
      const gatheringTime = Date.now() + BASE_GATHERING_TIME;

      hero.state = state;
      hero.gatheringFinishAt = gatheringTime;

      if (hero.location.chunkId) {
        const socketData: HeroUpdateEvent = {
          type: 'UPDATE_HERO',
          heroId: hero.id,
          payload: { state },
        };
        io.to(hero.location.chunkId).emit(socketEvents.mapUpdate(), socketData);
      }
      const returnData = {
        state: hero.state,
        gatheringFinishAt: hero.gatheringFinishAt,
      };

      return c.json<SuccessResponse<typeof returnData>>({
        message: `You begin ${gatherSkill.toLowerCase()}.`,
        success: true,
        data: returnData,
      });
    },
  )
  .post('/:id/gather/cancel', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');
    const hero = heroService.getHero(id);

    if (hero.state === 'IDLE') {
      throw new HTTPException(400, {
        message: 'You need gathering resource',
      });
    }
    verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

    hero.state = 'IDLE';
    hero.gatheringFinishAt = undefined;

    return c.json<SuccessResponse>({
      message: `You cancel gathering.`,
      success: true,
    });
  })
  .post(
    '/:id/action/refine/:refineBuildingKey',
    loggedIn,
    zValidator('param', z.object({ id: z.string(), refineBuildingKey: z.enum(refiningBuildingValues) })),
    zValidator('json', z.object({ containerId: z.string().uuid() })),

    async (c) => {
      const user = c.get('user');
      const { id, refineBuildingKey } = c.req.valid('param');
      const { containerId } = c.req.valid('json');
      const hero = heroService.getHero(id);
      if (hero.state !== 'IDLE') {
        throw new HTTPException(409, {
          message: 'Hero is currently busy with another action',
        });
      }
      const refineContainer = itemContainerService.getContainer(containerId);
      if (refineContainer.placeId !== hero.location.placeId) {
        throw new HTTPException(400, {
          message: 'Hero is not a place',
        });
      }
      if (!refineContainer.itemsInstance.length) {
        throw new HTTPException(400, {
          message: 'refine container is empty ',
          cause: { canShow: true },
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id, containerHeroId: refineContainer.ownerId, heroId: hero.id });

      for (const itemInstance of refineContainer.itemsInstance) {
        const refineItem = itemRefineableForBuilding({
          coreResource: itemInstance.coreResource,
          itemTemplateId: itemInstance.itemTemplateId,
          refiningBuildingKey: refineBuildingKey,
        });

        if (!refineItem?.isCanRefine)
          throw new HTTPException(400, {
            message: `${itemInstance.displayName ?? refineItem?.itemTemplate?.name} cannot be refined`,
            cause: { canShow: true },
          });
      }

      refiningService.createQueue(hero.id, refineBuildingKey, refineContainer.itemsInstance);
      console.log(serverState.queueRefine);
      const refiningQueues = refiningService.getQueueRefine(hero.id);

      const state = getStateWithRefiningBuildingKey(refineBuildingKey);
      const lastItem = refiningQueues.at(-1);

      if (!lastItem) {
        throw new HTTPException(400, { message: 'Not enough items or no refineable items found', cause: { canShow: true } });
      }
      const refiningFinishAt = lastItem?.finishAt;

      hero.state = state;
      hero.refiningFinishAt = refiningFinishAt;

      const returnData = { refiningFinishAt, state: hero.state };
      socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, state);

      return c.json<SuccessResponse<typeof returnData>>({
        message: `You begin ${state.toLowerCase()}.`,
        success: true,
        data: returnData,
      });
    },
  )
  .post('/:id/refine/cancel', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');
    const hero = heroService.getHero(id);

    if (hero.state === 'IDLE') {
      throw new HTTPException(400, {
        message: 'You need refining ',
      });
    }
    verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

    hero.state = 'IDLE';
    hero.refiningFinishAt = undefined;
    serverState.queueRefine.clear();
    socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, 'IDLE');

    return c.json<SuccessResponse>({
      message: `You cancel refining.`,
      success: true,
    });
  })

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
        message: 'queue fetched',
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
      const last = queueCraft.at(-1);
      if (last && last.craftBuildingType !== recipe.requirement.buildingCraftLocation) {
        throw new HTTPException(400, {
          message: 'You must work only one building',
          cause: { canShow: true },
        });
      }
      if (queueCraft.length >= MAX_QUEUE_CRAFT_ITEM) {
        throw new HTTPException(400, {
          message: `You cannot queue more than ${MAX_QUEUE_CRAFT_ITEM} craft items.`,
          cause: { canShow: true },
        });
      }

      queueCraftService.canStartCraft(hero.id, coreResourceId, recipeId);
      const now = Date.now();
      const isCore = recipe.requirement.materials.some((m) => m.role === 'CORE');
      if (!queueCraft.length) {
        queueCraft.push({
          id: generateRandomUuid(),
          recipeId,
          coreResourceId: isCore ? coreResourceId : undefined,
          expiresAt: now + recipe.timeMs,
          craftBuildingType: recipe.requirement.buildingCraftLocation,
          status: 'PROGRESS',
        });
        const stateData = getStateWithCraftBuildingType(recipe.requirement.buildingCraftLocation);
        hero.state = stateData;
        socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, stateData);
      } else {
        const last = queueCraft.at(-1)?.expiresAt;
        queueCraft.push({
          id: generateRandomUuid(),
          recipeId,
          coreResourceId: isCore ? coreResourceId : undefined,
          expiresAt: now + Math.max((last ?? 0) - now, 0) + recipe.timeMs,
          craftBuildingType: recipe.requirement.buildingCraftLocation,
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

  .post('/:id/item-container/create', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    const hero = heroService.getHero(id);

    const count = await db.$count(itemContainerTable, and(eq(itemContainerTable.ownerId, hero.id), eq(itemContainerTable.type, 'BANK')));
    verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

    const newPremiumCoinsValue = await db.transaction(async (tx) => {
      heroService.spendPremCoin(hero.id, BANK_CONTAINER_COST);

      const [newContainer] = await tx
        .insert(itemContainerTable)
        .values({
          ownerId: hero.id,
          placeId: hero.location?.placeId,
          type: 'BANK',
          name: `${count + 1}`,
        })
        .returning();
      serverState.container.set(newContainer.id, { ...newContainer, itemsInstance: [] });
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
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id, heroId: hero.id, containerHeroId: itemContainer.ownerId });

      await db
        .update(itemContainerTable)
        .set({
          ...data,
        })
        .where(eq(itemContainerTable.id, itemContainerId));
      itemContainer.color = data.color ? data.color : null;
      if (data.name) {
        itemContainer.name = data.name;
      }

      return c.json<SuccessResponse>({
        message: 'bank container changed!',
        success: true,
      });
    },
  );

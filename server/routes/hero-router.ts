import { BASE_STATS, HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT, RESET_STATS_COST } from '@/shared/constants';
import { type RegenHealthJob, type RegenManaJob, type WalkMapJob, type WalkPlaceJob, jobName } from '@/shared/job-types';
import type { HeroOnlineData, MapUpdateEvent, PlaceUpdateEvent, SelfHeroData, SelfMessageData } from '@/shared/socket-data-types';
import {
  type Buff,
  type Equipment,
  type EquipmentSlotType,
  type ErrorResponse,
  type GameItem,
  type GameItemType,
  type Hero,
  type InventoryItem,
  type SuccessResponse,
  type WeaponHandType,
  buildingTypeValues,
  createHeroSchema,
  statsSchema,
} from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, lt, lte, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { io } from '..';
import { HeroIcon } from '../../frontend/src/components/game-icons/HeroIcon';
import type { GameMessageType } from '../../frontend/src/store/useGameMessages';
import { socketEvents } from '../../shared/socket-events';
import type { Context } from '../context';
import { db } from '../db/db';
import {
  actionTable,
  equipmentTable,
  gameItemEnum,
  gameItemTable,
  heroTable,
  inventoryItemTable,
  locationTable,
  modifierTable,
  placeTable,
  slotEnum,
  stateTable,
  stateTypeEnum,
} from '../db/schema';
import { buffTable } from '../db/schema/buff-schema';
import { getHeroStatsWithModifiers } from '../lib/getHeroStatsWithModifiers';
import { heroOnline } from '../lib/heroOnline';
import {
  calculateManaRegenTime,
  calculateWalkTime,
  generateRandomUuid,
  getTileExists,
  jobQueueId,
  setSqlNow,
  setSqlNowByInterval,
  verifyHeroOwnership,
} from '../lib/utils';
import { validateHeroStats } from '../lib/validateHeroStats';
import { loggedIn } from '../middleware/loggedIn';
import { actionQueue } from '../queue/actionQueue';
import { equipmentService } from '../services/equipment-service';
import { heroService } from '../services/hero-service';
import { inventoryService } from '../services/inventory-service';

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
                },
              },
            },
          },
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

      await heroOnline(hero.id);

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

    if (heroExist) {
      throw new HTTPException(409, {
        message: 'Hero already exists for this user.',
      });
    }
    await db.transaction(async (tx) => {
      const place = await tx.query.placeTable.findFirst({
        where: eq(placeTable.name, 'Solmer Town'),
      });
      if (!place) {
        throw new HTTPException(404, {
          message: 'place not found',
        });
      }
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
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });

      if (!hero) {
        throw new HTTPException(404, { message: 'Hero not found' });
      }

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

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'Hero not found',
        });
      }

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
    '/:id/inventories',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const userId = c.get('user')?.id as string;
      const { id } = c.req.valid('param');
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });
      if (!hero) {
        throw new HTTPException(404, {
          message: 'Hero not found',
        });
      }

      verifyHeroOwnership({ heroUserId: hero.userId, userId });

      const inventories = await db.query.inventoryItemTable.findMany({
        where: eq(inventoryItemTable.heroId, id),
        with: {
          gameItem: { with: { weapon: true, armor: true, accessory: true, potion: true, resource: true } },
        },
        orderBy: asc(inventoryItemTable.createdAt),
      });

      return c.json<SuccessResponse<InventoryItem[]>>({
        message: 'inventories fetched !',
        success: true,
        data: inventories as InventoryItem[],
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
        const hero = await db.query.heroTable.findFirst({
          where: eq(heroTable.id, id),
        });
        if (!hero) throw new HTTPException(404, { message: 'Hero not found' });
        verifyHeroOwnership({ heroUserId: hero.userId, userId });
        const itemPrice = quantity * gameItem.price;
        const { data } = await inventoryService(tx).obtainInventoryItem({
          currentInventorySlots: hero.currentInventorySlots,
          maxInventorySlots: hero.maxInventorySlots,
          gameItemId: gameItem.id,
          gameItemType: gameItem.type,
          heroId: hero.id,
          quantity,
        });
        await heroService(tx).spendGold(hero.id, itemPrice, hero.goldCoins);
        return data;
      });

      return c.json<SuccessResponse<InventoryItem>>(
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

      const inventoryItem = await db.query.inventoryItemTable.findFirst({
        where: eq(inventoryItemTable.id, inventoryItemId),
        with: {
          gameItem: { with: { weapon: true, armor: true } },
        },
      });
      if (!inventoryItem) {
        throw new HTTPException(404, {
          message: 'inventory item not found',
        });
      }

      const isEquipment = inventoryItem?.gameItem.type === 'ARMOR' || inventoryItem?.gameItem.type === 'WEAPON';
      if (!inventoryItem) {
        throw new HTTPException(404, {
          message: 'inventory item not found',
        });
      }
      if (!isEquipment) {
        throw new HTTPException(403, {
          message: 'You cannot equip this item.',
        });
      }

      await db.transaction(async (tx) => {
        const hero = await db.query.heroTable.findFirst({
          where: eq(heroTable.id, id),
        });

        if (!hero) {
          throw new HTTPException(404, {
            message: 'hero not found',
          });
        }
        verifyHeroOwnership({ heroUserId: hero.userId, userId });
        const slot = await equipmentService(tx).getEquipSlot({
          heroId: hero.id,
          item: inventoryItem.gameItem,
          currentInventorySlots: hero.currentInventorySlots,
          maxInventorySlot: hero.maxInventorySlots,
        });

        if (!slot) {
          throw new HTTPException(404, {
            message: 'slot not found',
          });
        }
        const existingEquipItem = await equipmentService(tx).findEquipItem(slot, hero.id);
        if (existingEquipItem) {
          await equipmentService(tx).unEquipItem({
            equipmentItemId: existingEquipItem.id,
            gameItemId: existingEquipItem.gameItemId,
            heroId: hero.id,
            currentInventorySlots: hero.currentInventorySlots,
            maxInventorySlot: hero.maxInventorySlots,
          });
        }

        await equipmentService(tx).equipItem({
          gameItemId: inventoryItem.gameItemId,
          heroId: hero.id,
          slot,
          inventoryItemId: inventoryItem.id,
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
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }

      verifyHeroOwnership({ heroUserId: hero.userId, userId });

      const equipmentItem = await db.query.equipmentTable.findFirst({
        where: eq(equipmentTable.id, equipmentItemId),
        with: {
          gameItem: true,
        },
      });
      if (!equipmentItem) {
        throw new HTTPException(404, {
          message: 'equipment item not found',
        });
      }

      await db.transaction(async (tx) => {
        await equipmentService(tx).unEquipItem({
          currentInventorySlots: hero.currentInventorySlots,
          equipmentItemId: equipmentItem.id,
          gameItemId: equipmentItem.gameItemId,
          heroId: hero.id,
          maxInventorySlot: hero.maxInventorySlots,
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
    '/:id/inventory/:itemId/delete',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
        itemId: z.string(),
      }),
    ),

    async (c) => {
      const { id, itemId } = c.req.valid('param');
      const userId = c.get('user')?.id as string;
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }

      if (hero.userId !== userId) {
        throw new HTTPException(403, {
          message: 'access denied',
        });
      }

      const inventoryItem = await db.query.inventoryItemTable.findFirst({
        where: eq(inventoryItemTable.id, itemId),
        with: {
          gameItem: true,
        },
      });

      if (!inventoryItem) {
        throw new HTTPException(404, {
          message: 'Inventory item not found',
        });
      }

      await db.transaction(async (tx) => {
        await tx.delete(inventoryItemTable).where(eq(inventoryItemTable.id, inventoryItem.id));
        // await heroService(tx).incrementCurrentInventorySlots(hero.id);
        await heroService(tx).updateCurrentInventorySlots(hero.id);
      });

      return c.json<SuccessResponse<InventoryItem>>(
        {
          success: true,
          message: `Success deleted item`,
          data: inventoryItem,
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

      const inventoryItemPotion = await db.query.inventoryItemTable.findFirst({
        where: eq(inventoryItemTable.id, inventoryItemId),
        with: {
          gameItem: {
            with: {
              potion: true,
            },
          },
        },
      });

      if (!inventoryItemPotion) {
        throw new HTTPException(404, {
          message: 'inventory item not found',
        });
      }

      if (inventoryItemPotion.gameItem.type !== 'POTION') {
        throw new HTTPException(403, {
          message: 'This item not a potion',
        });
      }

      const isBuffPotion = inventoryItemPotion?.gameItem?.potion?.type === 'BUFF';
      const isHealthPotion = !!(inventoryItemPotion?.gameItem?.potion?.restore?.health ?? 0 > 0);
      const isManaPotion = !!(inventoryItemPotion?.gameItem?.potion?.restore?.mana ?? 0 > 0);
      const isRestorePotion = isHealthPotion && isManaPotion;

      await db.transaction(async (tx) => {
        const hero = await db.query.heroTable.findFirst({
          where: eq(heroTable.id, id),
        });

        if (!hero) {
          throw new HTTPException(404, {
            message: 'hero not found',
          });
        }
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

        await heroService(tx).drinkPotion({
          inventoryItemPotion,
          isBuffPotion,
          heroId: hero.id,
          currentHealth: hero.currentHealth,
          currentMana: hero.currentMana,
          maxHealth: hero.maxHealth,
          maxMana: hero.maxMana,
        });
        await inventoryService(tx).decrementInventoryItemQuantity(inventoryItemPotion.id, hero.id, inventoryItemPotion.quantity);
      });

      return c.json<SuccessResponse<InventoryItem>>({
        success: true,
        message: `You drink `,
        data: inventoryItemPotion,
      });
    },
  )
  .get('/:id/buffs', loggedIn, zValidator('param', z.object({ id: z.string() })), async (c) => {
    const userId = c.get('user')?.id;
    const { id } = c.req.valid('param');
    const hero = await db.query.heroTable.findFirst({
      where: eq(heroTable.id, id),
    });

    if (!hero) {
      throw new HTTPException(404, {
        message: 'hero not found',
      });
    }

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
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
        with: {
          action: { columns: { id: true } },
        },
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
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
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
        with: { location: { columns: { id: true } } },
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
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
        buildingType: z.enum(buildingTypeValues),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const { buildingType } = c.req.valid('json');
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
        with: {
          modifier: { columns: { dexterity: true } },
          location: { with: { place: true }, columns: { id: true } },
          action: { columns: { id: true } },
        },
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }

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
      const delay = calculateWalkTime(sumDex);
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
      const delay = calculateWalkTime(sumDex);
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

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
        with: {
          location: true,
          action: true,
        },
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
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

      await db.transaction(async (tx) => {
        await tx
          .update(locationTable)
          .set({
            mapId: null,
            placeId: place.id,
          })
          .where(eq(locationTable.heroId, hero.id));
      });

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

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
        with: {
          location: { with: { hero: true } },
          action: true,
        },
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
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

      await db.transaction(async (tx) => {
        await tx
          .update(locationTable)
          .set({
            mapId: place.mapId,
            x: place.x,
            y: place.y,
            placeId: null,
          })
          .where(eq(locationTable.heroId, hero.id));
      });

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

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
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
      const { sumStatAndModifier } = await getHeroStatsWithModifiers(db, hero.id);
      const every = calculateManaRegenTime(sumStatAndModifier.constitution);
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
        type: 'success',
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

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
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
      const { sumStatAndModifier } = await getHeroStatsWithModifiers(db, hero.id);
      const every = calculateManaRegenTime(sumStatAndModifier.intelligence);
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
        type: 'success',
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
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
        with: {
          action: true,
          state: { columns: { id: true } },
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
  );

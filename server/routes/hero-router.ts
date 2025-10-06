import { BASE_STATS, BASE_WALK_TIME, HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT, RESET_STATS_COST } from '@/shared/constants';
import { type WalkMapJob, type WalkTownJob, jobName } from '@/shared/job-types';
import type { HeroOnlineData, MapUpdateEvent, TownUpdateEvent } from '@/shared/socket-data-types';
import {
  type Buff,
  type Equipment,
  type EquipmentSlotType,
  type ErrorResponse,
  type GameItemType,
  type Hero,
  type InventoryItem,
  type SuccessResponse,
  type Tile,
  type Town,
  type WeaponHandType,
  createHeroSchema,
  statsSchema,
} from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, lte, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { io } from '..';
import { socketEvents } from '../../shared/socket-events';
import type { Context } from '../context';
import { db } from '../db/db';
import {
  actionTable,
  buildingNameTypeEnum,
  equipmentTable,
  gameItemEnum,
  gameItemTable,
  heroTable,
  inventoryItemTable,
  locationTable,
  modifierTable,
  slotEnum,
  stateTable,
  stateTypeEnum,
  tileTable,
  townNameTypeEnum,
  townTable,
} from '../db/schema';
import { buffTable } from '../db/schema/buff-schema';
import { restorePotion } from '../lib/restorePotion';
import { sumModifier } from '../lib/sumModifier';
import {
  calculateWalkTime,
  generateRandomUuid,
  getTileExists,
  jobQueueId,
  setSqlNow,
  setSqlNowByInterval,
  verifyHeroOwnership,
} from '../lib/utils';
import { loggedIn } from '../middleware/loggedIn';
import { actionQueue } from '../queue/actionQueue';

export const heroRouter = new Hono<Context>()
  .get(
    '/',
    loggedIn,

    async (c) => {
      const id = c.get('user')?.id as string;

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.userId, id),
      });
      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
      const inventoryCount = await db.$count(inventoryItemTable, eq(inventoryItemTable.inventoryHeroId, hero.id));
      await db
        .update(heroTable)
        .set({
          currentInventorySlots: inventoryCount,
        })
        .where(eq(heroTable.id, hero.id));
      await db.delete(buffTable).where(and(eq(buffTable.heroId, hero.id), lte(buffTable.completedAt, new Date().toISOString())));
      const updatedHero = await db.query.heroTable.findFirst({
        where: eq(heroTable.userId, id),
        with: {
          modifier: true,
          group: true,
          action: {
            extras: {
              timeRemaining: sql<number>`EXTRACT(EPOCH FROM ${actionTable.completedAt} - NOW())::INT`.as('timeRemaining'),
            },
          },
          state: true,
          location: {
            with: {
              town: true,
            },
          },
          equipments: {
            with: {
              gameItem: {
                with: {
                  modifier: true,
                },
              },
            },
          },
        },
      });

      return c.json<SuccessResponse<Hero>>({
        success: true,
        message: 'hero fetched',
        data: updatedHero as Hero,
      });
    },
  )
  .post('/create', loggedIn, zValidator('form', createHeroSchema), async (c) => {
    const { name, avatarImage, freeStatPoints, modifier: heroStats } = c.req.valid('form');
    const userId = c.get('user')?.id as string;

    const nameExist = await db.query.heroTable.findFirst({
      where: eq(heroTable.name, name),
    });
    if (nameExist) {
      return c.json<ErrorResponse>(
        {
          message: 'Hero name already taken. Please try another name.',
          success: false,
          isShowError: true,
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
      const town = await tx.query.townTable.findFirst({
        where: eq(townTable.name, 'SOLMERE'),
      });
      if (!town) {
        throw new HTTPException(404, {
          message: 'Town not found',
        });
      }
      const characterImage = '/sprites/new/newb-mage.webp';

      const [newHero] = await tx
        .insert(heroTable)
        .values({
          id: generateRandomUuid(),
          avatarImage,
          characterImage,
          name,
          userId,
          freeStatPoints,
          maxHealth: heroStats.constitution * HP_MULTIPLIER_COST,
          maxMana: heroStats.intelligence * MANA_MULTIPLIER_INT,
        })
        .returning();
      await tx.insert(modifierTable).values({
        id: generateRandomUuid(),
        heroId: newHero.id,
        ...heroStats,
      });
      await tx.insert(locationTable).values({ townId: town.id, heroId: newHero.id });
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
        with: { modifier: { columns: { id: true } } },
      });

      if (!hero) {
        throw new HTTPException(404, { message: 'Hero not found' });
      }
      if (!hero.modifier?.id) {
        throw new HTTPException(404, { message: 'modifier id  not found' });
      }

      if (hero.userId !== userId) {
        throw new HTTPException(403, { message: 'Access denied' });
      }

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
          })
          .where(eq(heroTable.id, id));
        await tx
          .update(heroTable)
          .set({
            goldCoins: hero.goldCoins - RESET_STATS_COST,
          })
          .where(eq(heroTable.id, id));
        await tx
          .update(modifierTable)
          .set({
            ...BASE_STATS,
          })
          .where(eq(modifierTable.id, hero.modifier!.id));
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
      'form',
      statsSchema.extend({
        freeStatPoints: z.number({
          coerce: true,
        }),
      }),
    ),
    async (c) => {
      const userId = c.get('user')?.id as string;
      const { id } = c.req.valid('param');
      const { freeStatPoints, ...newStats } = c.req.valid('form');

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
        with: { modifier: { columns: { id: true } } },
      });
      if (!hero) {
        throw new HTTPException(404, {
          message: 'Hero not found',
        });
      }
      if (!hero.modifier?.id) {
        throw new HTTPException(404, {
          message: 'modifier id not found',
        });
      }
      if (hero.userId !== userId) {
        throw new HTTPException(403, {
          message: 'access denied',
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .update(heroTable)
          .set({
            freeStatPoints,
          })
          .where(eq(heroTable.id, id));
        await tx
          .update(modifierTable)
          .set({
            ...newStats,
          })
          .where(eq(modifierTable.id, hero.modifier!.id));
      });
      return c.json<SuccessResponse>({ success: true, message: 'Stats have been successfully updated.' }, 200);
    },
  )
  .put(
    '/:id/status',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator(
      'json',
      z.object({
        isOnline: z.boolean(),
      }),
    ),

    async (c) => {
      const userId = c.get('user')?.id as string;
      const { id } = c.req.valid('param');
      const { isOnline } = c.req.valid('json');

      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });
      if (!hero) {
        throw new HTTPException(404, {
          message: 'Hero not found',
        });
      }
      if (hero.userId !== userId) {
        throw new HTTPException(403, {
          message: 'access denied',
        });
      }
      const jobId = jobQueueId.offline(hero.id);
      await actionQueue.remove(jobId);

      const location = await db.query.locationTable.findFirst({
        where: eq(locationTable.heroId, hero.id),
        with: { hero: true },
      });
      if (!location) {
        throw new HTTPException(404, {
          message: 'location not found',
        });
      }
      const socketData: HeroOnlineData = {
        type: 'HERO_ONLINE',
        payload: location,
      };

      await db
        .update(heroTable)
        .set({
          isOnline,
        })
        .where(eq(heroTable.id, id));

      if (location.mapId) {
        io.to(location.mapId).emit(socketEvents.mapUpdate(), socketData);
      }
      if (location.townId) {
        io.to(location.townId).emit(socketEvents.townUpdate(), socketData);
      }

      return c.json<SuccessResponse>({ success: true, message: 'hero status change' }, 200);
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
      if (hero.userId !== userId) {
        throw new HTTPException(403, {
          message: 'access denied',
        });
      }

      const inventories = await db.query.inventoryItemTable.findMany({
        where: eq(inventoryItemTable.inventoryHeroId, id),
        with: {
          gameItem: { with: { modifier: true } },
        },
        orderBy: asc(inventoryItemTable.id),
      });

      return c.json<SuccessResponse<InventoryItem[]>>({
        message: 'inventories fetched !',
        success: true,
        data: inventories,
      });
    },
  )
  .post(
    '/:id/shop/items/:itemId/buy',
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

      const gameItem = await db.query.gameItemTable.findFirst({
        where: eq(gameItemTable.id, itemId),
        with: {
          modifier: true,
        },
      });
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });
      if (!gameItem) {
        throw new HTTPException(404, {
          message: 'game item not found',
        });
      }
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
      if (hero.currentInventorySlots >= hero.maxInventorySlots) {
        return c.json<ErrorResponse>(
          {
            success: false,
            message: 'Inventory is  full',
            isShowError: true,
          },
          400,
        );
      }
      if (hero.goldCoins < gameItem.price) {
        return c.json<ErrorResponse>(
          {
            success: false,
            message: 'Not enough gold',
            isShowError: true,
          },
          422,
        );
      }
      const inventoryItem = await db.query.inventoryItemTable.findFirst({
        where: eq(inventoryItemTable.gameItemId, itemId),
        with: {
          gameItem: {
            with: {
              modifier: true,
            },
          },
        },
      });
      if (gameItem.type === 'POTION' && inventoryItem) {
        await db.transaction(async (tx) => {
          await tx
            .update(heroTable)
            .set({
              goldCoins: hero.goldCoins - gameItem.price,
            })
            .where(eq(heroTable.id, id));
          await tx
            .update(inventoryItemTable)
            .set({
              quantity: inventoryItem.quantity + 1,
            })
            .where(eq(inventoryItemTable.id, inventoryItem.id));
        });

        return c.json<SuccessResponse<InventoryItem>>(
          {
            success: true,
            message: 'You success buy item',
            data: inventoryItem,
          },
          200,
        );
      }

      const [newInventoryItem] = await db.transaction(async (tx) => {
        await tx
          .update(heroTable)
          .set({
            currentInventorySlots: hero.currentInventorySlots + 1,
          })
          .where(eq(heroTable.id, id));
        await tx
          .update(heroTable)
          .set({
            goldCoins: hero.goldCoins - gameItem.price,
          })
          .where(eq(heroTable.id, id));
        return await tx
          .insert(inventoryItemTable)
          .values({
            id: generateRandomUuid(),
            gameItemId: itemId,
            inventoryHeroId: id,
          })
          .returning();
      });

      return c.json<SuccessResponse<InventoryItem>>(
        {
          success: true,
          message: 'You success buy item',
          data: { ...newInventoryItem, gameItem },
        },
        201,
      );
    },
  )
  .post(
    '/:id/inventory/:itemId/equip',
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

      const isNotEquipment = inventoryItem?.gameItem.type === 'MISC' || inventoryItem?.gameItem.type === 'POTION';
      if (!inventoryItem) {
        throw new HTTPException(404, {
          message: 'inventory item not found',
        });
      }
      if (isNotEquipment) {
        throw new HTTPException(403, {
          message: 'You cannot equip this item.',
        });
      }
      const getEquipSlot = async (itemType: GameItemType, weaponHand: WeaponHandType | null): Promise<EquipmentSlotType | undefined> => {
        const findEnumSlot = slotEnum.enumValues.find((type) => type === itemType);
        if (!findEnumSlot) {
          throw new HTTPException(404, {
            message: 'equip slot not find',
          });
        }

        if (weaponHand === 'TWO_HANDED') {
          const findRightHandSlot = await db.query.equipmentTable.findFirst({
            where: eq(equipmentTable.slot, 'RIGHT_HAND'),
          });
          const findLeftHandSlot = await db.query.equipmentTable.findFirst({
            where: eq(equipmentTable.slot, 'LEFT_HAND'),
          });
          if (!findRightHandSlot && !findLeftHandSlot) {
            return 'RIGHT_HAND';
          }
          return undefined;
        }
        if (weaponHand === 'ONE_HANDED') {
          const findRightHandSlot = await db.query.equipmentTable.findFirst({
            where: eq(equipmentTable.slot, 'RIGHT_HAND'),
            with: {
              gameItem: true,
            },
          });
          if (findRightHandSlot?.gameItem.weaponHand === 'TWO_HANDED') {
            return undefined;
          }
          if (!findRightHandSlot) {
            return 'RING_RIGHT';
          }
          const findLeftHandSlot = await db.query.equipmentTable.findFirst({
            where: eq(equipmentTable.slot, 'LEFT_HAND'),
          });
          if (!findLeftHandSlot) {
            return 'LEFT_HAND';
          }
          return undefined;
        }
        if (itemType === 'SHIELD') {
          const findRightHandSlot = await db.query.equipmentTable.findFirst({
            where: eq(equipmentTable.slot, 'RIGHT_HAND'),
            with: { gameItem: true },
          });
          if (findRightHandSlot?.gameItem.weaponHand === 'TWO_HANDED') {
            return undefined;
          }
          const findLeftHandSlot = await db.query.equipmentTable.findFirst({
            where: eq(equipmentTable.slot, 'LEFT_HAND'),
          });
          if (!findLeftHandSlot) {
            return 'LEFT_HAND';
          }
          return undefined;
        }
        if (itemType === 'RING') {
          const findLeftRing = await db.query.equipmentTable.findFirst({
            where: eq(equipmentTable.slot, 'RING_LEFT'),
          });
          if (!findLeftRing) {
            return 'RING_LEFT';
          }
          const findRightRing = await db.query.equipmentTable.findFirst({
            where: eq(equipmentTable.slot, 'RING_RIGHT'),
          });
          if (!findRightRing) {
            return 'RING_RIGHT';
          }
          return undefined;
        }

        const existing = await db.query.equipmentTable.findFirst({
          where: eq(equipmentTable.slot, findEnumSlot),
        });
        if (existing) {
          return undefined;
        }
        return findEnumSlot;
      };

      const newEquipSlot = await getEquipSlot(inventoryItem.gameItem.type, inventoryItem.gameItem.weaponHand);
      if (!newEquipSlot) {
        return c.json<ErrorResponse>(
          {
            success: false,
            message: 'Please unequip the currently equipped item before replacing it.',
            isShowError: true,
          },
          409,
        );
      }

      await db.transaction(async (tx) => {
        const existSlot = await db.query.equipmentTable.findFirst({
          where: eq(equipmentTable.slot, newEquipSlot),
        });
        if (existSlot) {
          tx.rollback();
        }
        await tx.insert(equipmentTable).values({
          id: generateRandomUuid(),
          equipmentHeroId: hero.id,
          gameItemId: inventoryItem.gameItemId,
          slot: newEquipSlot,
        });
        await tx
          .update(heroTable)
          .set({
            currentInventorySlots: hero.currentInventorySlots - 1,
          })
          .where(eq(heroTable.id, hero.id));
        await tx.delete(inventoryItemTable).where(eq(inventoryItemTable.id, inventoryItem.id));
      });

      return c.json<SuccessResponse<InventoryItem>>(
        {
          success: true,
          message: `success equipped item `,
          data: inventoryItem,
        },
        201,
      );
    },
  )
  .post(
    '/:id/equipment/:itemId/unequip',
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
      const isInventoryFull = hero.currentInventorySlots >= hero.maxInventorySlots;

      if (hero.userId !== userId) {
        throw new HTTPException(403, {
          message: 'access denied',
        });
      }
      if (isInventoryFull) {
        return c.json<ErrorResponse>(
          {
            success: false,
            message: `inventory is full`,
          },
          409,
        );
      }
      const equipmentItem = await db.query.equipmentTable.findFirst({
        where: eq(equipmentTable.id, itemId),
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
        const hero = await tx.query.heroTable.findFirst({
          where: eq(heroTable.id, id),
        });

        if (!hero) {
          throw new HTTPException(404, {
            message: 'hero not found',
          });
        }
        const isInventoryFull = hero.currentInventorySlots >= hero.maxInventorySlots;
        if (isInventoryFull) {
          tx.rollback();
        }

        await tx.delete(equipmentTable).where(eq(equipmentTable.id, itemId));
        await tx
          .update(heroTable)
          .set({
            currentInventorySlots: hero.currentInventorySlots + 1,
          })
          .where(eq(heroTable.id, hero.id));
        await tx.insert(inventoryItemTable).values({
          id: generateRandomUuid(),
          inventoryHeroId: hero.id,
          gameItemId: equipmentItem.gameItemId,
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
        await tx
          .update(heroTable)
          .set({
            currentInventorySlots: hero.currentInventorySlots + 1,
          })
          .where(eq(heroTable.id, id));
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
    '/:id/inventory/:itemId/drink',
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

      const inventoryItemPotion = await db.query.inventoryItemTable.findFirst({
        where: eq(inventoryItemTable.id, itemId),
        with: {
          gameItem: {
            with: {
              modifier: true,
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
      const isHealthPotion = inventoryItemPotion.gameItem.modifier.restoreHealth && !inventoryItemPotion.gameItem.modifier.restoreMana;
      const isManaPotion = inventoryItemPotion.gameItem.modifier.restoreMana && !inventoryItemPotion.gameItem.modifier.restoreHealth;

      const isBuffPotion = inventoryItemPotion.gameItem.duration > 0;
      const isFullHealth = hero.currentHealth >= hero.maxHealth;
      const isFullMana = hero.currentMana >= hero.maxMana;
      if (isHealthPotion) {
        if (isFullHealth && isHealthPotion) {
          return c.json<ErrorResponse>(
            {
              message: 'You are already at full health',
              isShowError: true,
              success: false,
            },
            400,
          );
        }
        await restorePotion({
          currentHealth: hero.currentHealth,
          currentMana: hero.currentMana,
          maxHealth: hero.maxHealth,
          maxMana: hero.maxMana,
          restoreHealth: inventoryItemPotion.gameItem.modifier.restoreHealth,
          restoreMana: inventoryItemPotion.gameItem.modifier.restoreMana,
          heroId: id,
          itemId,
          potionQuantity: inventoryItemPotion.quantity,
        });
        return c.json<SuccessResponse<InventoryItem>>({
          success: true,
          message: `You success use potion`,
          data: inventoryItemPotion,
        });
      }
      if (isManaPotion) {
        if (isManaPotion && isFullMana) {
          return c.json<ErrorResponse>(
            {
              message: 'You are already at full mana',
              isShowError: true,
              success: false,
            },
            400,
          );
        }
        await restorePotion({
          currentHealth: hero.currentHealth,
          currentMana: hero.currentMana,
          maxHealth: hero.maxHealth,
          maxMana: hero.maxMana,
          restoreHealth: inventoryItemPotion.gameItem.modifier.restoreHealth,
          restoreMana: inventoryItemPotion.gameItem.modifier.restoreMana,
          heroId: id,
          itemId,
          potionQuantity: inventoryItemPotion.quantity,
        });
      }

      if (isBuffPotion) {
        const statKeys = Object.keys(statsSchema.shape) as (keyof typeof statsSchema.shape)[];
        const findStatBuffName = inventoryItemPotion.gameItem.name
          .split(' ')
          .find((text) => statKeys.includes(text as keyof typeof statsSchema.shape));
        if (findStatBuffName) {
          await db.delete(buffTable).where(and(eq(buffTable.heroId, id), eq(buffTable.name, inventoryItemPotion.gameItem.name)));
        }
        await db.transaction(async (tx) => {
          const completedAt = new Date(Date.now() + inventoryItemPotion.gameItem.duration).toISOString();
          const [modifier] = await tx
            .insert(modifierTable)
            .values({
              ...inventoryItemPotion.gameItem.modifier,
              id: generateRandomUuid(),
              createdAt: new Date().toISOString(),
            })
            .returning();

          await tx.insert(buffTable).values({
            id: generateRandomUuid(),
            name: inventoryItemPotion.gameItem.name,
            image: inventoryItemPotion.gameItem.image,
            duration: inventoryItemPotion.gameItem.duration,
            type: 'POTION',
            modifierId: modifier.id,
            heroId: id,
            completedAt,
          });
          if (inventoryItemPotion.quantity > 1) {
            await tx
              .update(inventoryItemTable)
              .set({
                quantity: inventoryItemPotion.quantity - 1,
              })
              .where(eq(inventoryItemTable.id, itemId));
            return;
          }
          await tx.delete(inventoryItemTable).where(eq(inventoryItemTable.id, itemId));
        });

        return c.json<SuccessResponse<InventoryItem>>({
          success: true,
          message: `You success use potion`,
          data: inventoryItemPotion,
        });
      }
      await restorePotion({
        currentHealth: hero.currentHealth,
        currentMana: hero.currentMana,
        maxHealth: hero.maxHealth,
        maxMana: hero.maxMana,
        restoreHealth: inventoryItemPotion.gameItem.modifier.restoreHealth,
        restoreMana: inventoryItemPotion.gameItem.modifier.restoreMana,
        heroId: id,
        itemId,
        potionQuantity: inventoryItemPotion.quantity,
      });
      return c.json<SuccessResponse<InventoryItem>>({
        success: true,
        message: `You success use potion`,
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

    if (hero.userId !== userId) {
      throw new HTTPException(403, {
        message: 'access denied',
      });
    }
    const buffs = await db.query.buffTable.findMany({
      with: {
        modifier: true,
      },
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
    '/:id/action/walk-town',
    loggedIn,
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'json',
      z.object({
        buildingName: z.enum(buildingNameTypeEnum.enumValues),
      }),
    ),
    async (c) => {
      const user = c.get('user');
      const { id } = c.req.valid('param');
      const { buildingName } = c.req.valid('json');
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
        with: {
          modifier: { columns: { dexterity: true } },
          location: { with: { town: true }, columns: { id: true } },
          action: { columns: { id: true } },
        },
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
      if (!hero.modifier?.dexterity) {
        throw new HTTPException(404, {
          message: 'modifier dexterity not found',
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
      if (!hero.location?.town?.id) {
        throw new HTTPException(403, {
          message: 'Missing townId: hero is not assigned to a town',
        });
      }
      verifyHeroOwnership({ heroUserId: hero.userId, userId: user?.id });

      const jobId = hero.id;
      const delay = calculateWalkTime(hero.modifier.dexterity);
      await db
        .update(actionTable)
        .set({
          startedAt: new Date().toISOString(),
          completedAt: new Date(Date.now() + delay).toISOString(),
          type: 'WALK',
        })
        .where(eq(actionTable.id, hero.action.id));
      const jobData: WalkTownJob = {
        jobName: 'WALK_TOWN',
        payload: {
          actionId: hero.action.id,
          locationId: hero.location.id,
          heroId: hero.id,
          type: 'IDLE',
          buildingName,
        },
      };
      await actionQueue.remove(jobId);
      await actionQueue.add(jobName['walk-town'], jobData, {
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
      const delay = calculateWalkTime(hero.modifier?.dexterity ?? 10);
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
    '/:id/action/enter-town',
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
      const town = await db.query.townTable.findFirst({
        where: and(eq(townTable.x, heroPosX), eq(townTable.y, heroPosY)),
      });
      if (!town) {
        throw new HTTPException(404, {
          message: 'town not found',
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .update(locationTable)
          .set({
            mapId: null,
            townId: town.id,
          })
          .where(eq(locationTable.heroId, hero.id));
      });

      const socketMapData: MapUpdateEvent = {
        type: 'HERO_ENTER_TOWN',
        payload: {
          townId: town.id,
          heroId: hero.id,
        },
      };
      const socketTownData: TownUpdateEvent = {
        type: 'HERO_ENTER_TOWN',
        payload: { ...hero.location, hero: hero as Hero },
      };
      io.to(hero.location.mapId!).emit(socketEvents.mapUpdate(), socketMapData);
      io.to(town.id).emit(socketEvents.townUpdate(), socketTownData);

      return c.json<SuccessResponse>({
        message: 'enter town success',
        success: true,
      });
    },
  )
  .post(
    '/:id/action/leave-town',
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
      if (!hero.location?.townId) {
        throw new HTTPException(403, {
          message: 'Missing townId: hero is not assigned to a town',
        });
      }
      const town = await db.query.townTable.findFirst({
        where: eq(townTable.id, hero.location.townId),
      });
      if (!town) {
        throw new HTTPException(404, {
          message: 'town not found',
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .update(locationTable)
          .set({
            mapId: town.mapId,
            x: town.x,
            y: town.y,
            townId: null,
          })
          .where(eq(locationTable.heroId, hero.id));
      });

      const socketMapData: MapUpdateEvent = {
        type: 'HERO_LEAVE_TOWN',
        payload: {
          heroId: hero.id,
          mapId: town.mapId,
          location: hero.location,
        },
      };
      const socketTownData: TownUpdateEvent = {
        type: 'HERO_LEAVE_TOWN',
        payload: {
          heroId: hero.id,
          mapId: town.mapId,
        },
      };

      io.to(town.id).emit(socketEvents.townUpdate(), socketTownData);
      io.to(town.mapId).emit(socketEvents.mapUpdate(), socketMapData);

      return c.json<SuccessResponse>({
        message: 'leave town success ',
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

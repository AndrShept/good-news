import { BASE_STATS, RESET_STATS_COST } from '@/shared/constants';
import {
  type Buff,
  type Equipment,
  type EquipmentSlotType,
  type ErrorResponse,
  type GameItemType,
  type Hero,
  type InventoryItem,
  type SuccessResponse,
  type WeaponHandType,
  createHeroSchema,
  statsSchema,
} from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, lte, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { equipmentTable, gameItemEnum, gameItemTable, heroTable, inventoryItemTable, modifierTable, slotEnum } from '../db/schema';
import { buffTable } from '../db/schema/buff-schema';
import { HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT } from '../lib/constants';
import { restorePotion } from '../lib/restorePotion';
import { sumModifier } from '../lib/sumModifier';
import { generateRandomUuid } from '../lib/utils';
import { loggedIn } from '../middleware/loggedIn';

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
    const newHero = await db.transaction(async (tx) => {
      const [newModifier] = await tx
        .insert(modifierTable)
        .values({
          id: generateRandomUuid(),
          ...heroStats,
        })
        .returning({ id: modifierTable.id });
      const [newHero] = await tx
        .insert(heroTable)
        .values({
          id: generateRandomUuid(),
          avatarImage,
          characterImage: '',
          name,
          userId,
          modifierId: newModifier.id,
          freeStatPoints,
          maxHealth: heroStats.constitution * HP_MULTIPLIER_COST,
          maxMana: heroStats.intelligence * MANA_MULTIPLIER_INT,
        })
        .returning();
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
        with: { modifier: true },
      });

      if (!hero) {
        throw new HTTPException(404, { message: 'Hero not found' });
      }

      if (hero.userId !== userId) {
        throw new HTTPException(403, { message: 'Access denied' });
      }
      if (!hero.modifierId) {
        throw new HTTPException(404, { message: 'modifier_Id not found' });
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
          .where(eq(modifierTable.id, hero.modifierId!));
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
          .where(eq(modifierTable.id, hero.modifierId ?? ''));
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
  });

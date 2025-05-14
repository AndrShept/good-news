import { BASE_STATS, RESET_STATS_COST } from '@/shared/constants';
import { type ErrorResponse, type Hero, type InventoryItem, type SuccessResponse, createHeroSchema, statsSchema } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, inventoryItemTable, modifierTable } from '../db/schema';
import { HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT } from '../lib/constants';
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
        with: {
          modifier: true,
          equipments: true,
        },
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
      return c.json<SuccessResponse<Hero>>({
        success: true,
        message: 'hero fetched',
        data: hero as Hero,
      });
    },
  )
  .post('/create', loggedIn, zValidator('form', createHeroSchema), async (c) => {
    const { name, image, freeStatPoints, modifier: heroStats } = c.req.valid('form');
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
          image,
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
        where: eq(inventoryItemTable.heroId, id),
        with: {
          gameItem: true,
        },
      });

      return c.json<SuccessResponse<InventoryItem[]>>({
        message: 'inventories fetched !',
        success: true,
        data: inventories as InventoryItem[],
      });
    },
  );

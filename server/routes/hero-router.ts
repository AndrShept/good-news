import { type ErrorResponse, type Hero, type SuccessResponse, createHeroSchema } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, modifierTable } from '../db/schema';
import { generateRandomUuid } from '../lib/utils';
import { loggedIn } from '../middleware/loggedIn';
import { HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT } from '../lib/constants';

export const heroRouter = new Hono<Context>()
  .get(
    '/',
    loggedIn,

    async (c) => {
      const id = c.get('user')?.id as string;
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.userId, id),
        with: {
          modifier: true
        }
      });

      if (!hero) {
        throw new HTTPException(404, {
          message: 'hero not found',
        });
      }
      return c.json<SuccessResponse<Hero>>({
        success: true,
        message: 'hero fetched',
        data: hero,
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
          maxHealth: heroStats.constitution *  HP_MULTIPLIER_COST,
          maxMana: heroStats.intelligence * MANA_MULTIPLIER_INT
        })
        .returning();
      return newHero;
    });

    return c.json<SuccessResponse<Hero>>({ message: 'hero created!', success: true, data: newHero });
  });

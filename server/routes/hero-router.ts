import { type ErrorResponse, type Hero, type SuccessResponse, createHeroSchema } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { Context } from '../context';
import { db } from '../db/db';
import { hero, modifier, userTable } from '../db/schema';
import { generateRandomUuid } from '../lib/utils';
import { loggedIn } from '../middleware/loggedIn';

export const heroRouter = new Hono<Context>()
  .get(
    '/',
    loggedIn,

    async (c) => {
      const id = c.get('user')?.id;
      const hero = await db.query.hero.findFirst({
        where: eq(userTable.id, id!),
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
    const { name, image } = c.req.valid('form');
    const userId = c.get('user')?.id as string;

    const nameExist = await db.query.hero.findFirst({
      where: eq(hero.name, name),
    });
    if (nameExist) {
      // throw new HTTPException(409, {
      //   message: 'Hero name already taken. Please try another name.',

      // });
      return c.json<ErrorResponse>(
        {
          message: 'Hero name already taken. Please try another name.',
          success: false,
          isShowError: true,
        },
        409,
      );
    }
    const heroExist = await db.query.hero.findFirst({
      where: eq(hero.userId, userId),
    });
    if (heroExist) {
      throw new HTTPException(409, {
        message: 'Hero already exists for this user.',
      });
    }
    const newHero = await db.transaction(async (tx) => {
      const [newModifier] = await tx
        .insert(modifier)
        .values({
          id: generateRandomUuid(),
        })
        .returning({ id: modifier.id });
      const [newHero] = await tx
        .insert(hero)
        .values({
          id: generateRandomUuid(),
          image,
          name,
          userId,
          modifierId: newModifier.id,
        })
        .returning();
      return newHero;
    });

    return c.json<SuccessResponse<Hero>>({ message: 'hero created!', success: true, data: newHero });
  });

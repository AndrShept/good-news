import type { GameItem, Hero, PaginatedResponse, SuccessResponse, User } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, ilike, isNull, ne } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { groupTable, heroTable } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';

export const groupRouter = new Hono<Context>()
  .get(
    '/available-heroes',
    loggedIn,
    zValidator(
      'query',
      z.object({
        page: z.number({ coerce: true }),
        searchTerm: z.string(),
        selfId: z.string(),
      }),
    ),
    async (c) => {
      const { page, searchTerm, selfId } = c.req.valid('query');
      const limit = 10;
      const offset = (page - 1) * limit;

      const where = and(
        eq(heroTable.isOnline, true),
        isNull(heroTable.groupId),
        ne(heroTable.id, selfId),
        ilike(heroTable.name, `%${searchTerm}%`),
      );
      const heroes = await db.query.heroTable.findMany({
        limit,
        offset,
        where,
      });
      const totalPages = Math.ceil(heroes.length / limit);
      return c.json<PaginatedResponse<Hero[]>>({
        message: 'available heroes fetched!',
        success: true,
        data: heroes,
        pagination: {
          page,
          totalPages,
          isMore: page < totalPages,
        },
      });
    },
  )
  .get(
    '/:id/heroes',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const group = await db.query.groupTable.findFirst({
        where: eq(groupTable.id, id),
      });
      if (!group) {
        throw new HTTPException(404, { message: 'group not found' });
      }
      const heroes = await db.query.heroTable.findMany({
        where: eq(heroTable.groupId, id),
      });

      return c.json<SuccessResponse<Hero[]>>(
        {
          message: 'group members  fetched!',
          success: true,
          data: heroes,
        },
        200,
      );
    },
  );

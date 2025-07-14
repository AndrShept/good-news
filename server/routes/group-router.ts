import type { GameItem, Hero, PaginatedResponse, SuccessResponse, User } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { loggedIn } from '../middleware/loggedIn';

export const groupRouter = new Hono<Context>().get(
  '/available-heroes',
  loggedIn,
  zValidator(
    'query',
    z.object({
      page: z.number({ coerce: true }),
    }),
  ),
  async (c) => {
    const { page } = c.req.valid('query');
    const limit = 10;
    const offset = (page - 1) * limit;

    const heroes = await db.query.heroTable.findMany({
      limit,
      offset,
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
);

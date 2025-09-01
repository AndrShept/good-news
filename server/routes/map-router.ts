import type { Map, SuccessResponse } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, mapNameTypeEnum, mapTable, tileTable } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';

export const mapRouter = new Hono<Context>().get(
  '/:id',
  loggedIn,
  zValidator(
    'param',
    z.object({
      id: z.string(),
    }),
  ),

  async (c) => {
    const { id } = c.req.valid('param');
    let map = await db.query.mapTable.findFirst({
      where: eq(mapTable.id, id),
      with: {
        tiles: {
          with: {
            town: true,
            heroes: {
              where: eq(heroTable.isOnline, true),
            },
          },
        },
      },
    });

    return c.json<SuccessResponse<Map>>({
      message: 'map fetched!',
      success: true,
      data: map as Map,
    });
  },
);

import type { Map, SuccessResponse, Tile } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, mapTable, tileTable } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';

export const tileRouter = new Hono<Context>().get(
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
    const tile = await db.query.tileTable.findFirst({
      where: eq(tileTable.id, id),
      with: {
        town: true,
      },
    });

    return c.json<SuccessResponse<typeof tile>>({
      message: 'tile fetched!',
      success: true,
      data: tile,
    });
  },
);

import type { Map, SuccessResponse } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { mapNameTypeEnum, mapTable, tileTable } from '../db/schema';
import { buildingMapData } from '../lib/buildingMapData';
import { loggedIn } from '../middleware/loggedIn';

export const mapRouter = new Hono<Context>().get(
  '/:name',
  loggedIn,
  zValidator(
    'param',
    z.object({
      name: z.enum(mapNameTypeEnum.enumValues),
    }),
  ),

  async (c) => {
    const { name } = c.req.valid('param');
    let map = await db.query.mapTable.findFirst({
      where: eq(mapTable.name, name),
      with: {
        tiles: {
          with: {
            worldObject: true,
            heroes: true,
          },
        },
      },
    });
    if (!map) {
      map = await buildingMapData(name);
    }

    return c.json<SuccessResponse<Map>>({
      message: 'map fetched!',
      success: true,
      data: map as Map,
    });
  },
);

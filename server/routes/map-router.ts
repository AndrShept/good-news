import type { Map, SuccessResponse } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, mapNameTypeEnum, mapTable, tileTable } from '../db/schema';
import { buildGrid } from '../lib/utils';
import { loggedIn } from '../middleware/loggedIn';
import { buildingMapData } from '../lib/buildingMapData';

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
    console.log('GET MAP')

    const tilesGrid = buildGrid(map as Map);
    return c.json<SuccessResponse<Map>>({
      message: 'map fetched!',
      success: true,
      data: { ...map, tiles: undefined, tilesGrid } as Map,
    });
  },
);

import type { Map, SuccessResponse } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, mapNameTypeEnum, mapTable, tileTable } from '../db/schema';
import { buildingMapData, getMapJson } from '../lib/buildingMapData';
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
    const userId = c.get('user')?.id as string;

    let map = await db.query.mapTable.findFirst({
      where: eq(mapTable.id, id),
      with: {
        heroesLocation: { with: { hero: true } },
        towns: true,
      },
    });
    console.log('GET MAP');
    const mapJson = getMapJson(map?.id ?? '');

    return c.json<SuccessResponse<Map>>({
      message: 'map fetched!',
      success: true,
      data: { ...map, layers: mapJson.jsonUrl.layers } as Map,
    });
  },
);

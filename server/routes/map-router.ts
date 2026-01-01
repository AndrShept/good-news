import type { Location, Map, MapHero, SuccessResponse } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, locationTable, mapTable } from '../db/schema';
import { getMapJson } from '../lib/utils';
import { loggedIn } from '../middleware/loggedIn';

export const mapRouter = new Hono<Context>()
  .get(
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

      const map = await db.query.mapTable.findFirst({
        where: eq(mapTable.id, id),
        with: { places: true },
      });
      if (!map) {
        throw new HTTPException(404, {
          message: 'map not found',
        });
      }

      const mapJson = getMapJson(map.id);

  
      return c.json<SuccessResponse<Map>>({
        message: 'map fetched!',
        success: true,
        data: { ...map, layers: mapJson.layers } as Map,
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
      const map = await db.query.mapTable.findFirst({
        where: eq(mapTable.id, id),
      });
      if (!map) {
        throw new HTTPException(404, {
          message: 'map not found',
        });
      }

      const mapHeroes = await db
        .select({
          id: heroTable.id,
          name: heroTable.name,
          state: heroTable.state,
          level: heroTable.level,
          avatarImage: heroTable.avatarImage,
          characterImage: heroTable.characterImage,
          x: locationTable.x,
          y: locationTable.y,
        })
        .from(heroTable)
        .innerJoin(locationTable, eq(locationTable.heroId, heroTable.id))
        .where(and(eq(locationTable.mapId, map.id), eq(heroTable.isOnline, true)));

      return c.json<SuccessResponse<MapHero[]>>({
        message: 'map sidebar heroes fetched!',
        success: true,
        data: mapHeroes,
      });
    },
  );

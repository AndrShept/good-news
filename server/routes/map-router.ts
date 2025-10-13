
import type { Location, Map, SuccessResponse } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import {  locationTable, mapTable } from '../db/schema';
import {  getMapJson } from '../lib/buildingMapData';
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

      console.log('GET MAP');
      return c.json<SuccessResponse<Map>>({
        message: 'map fetched!',
        success: true,
        data: { ...map, layers: mapJson.jsonUrl.layers } as Map,
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

      const locationHeroes = await db.query.locationTable.findMany({
        with: { hero: true },
        where: eq(locationTable.mapId, id),
      });

      const onlineLocationHeroes = locationHeroes.filter((l) => l.hero?.isOnline);

      return c.json<SuccessResponse<Location[]>>({
        message: 'location heroes fetched!',
        success: true,
        data: onlineLocationHeroes,
      });
    },
  );

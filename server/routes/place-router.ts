import type { Location, Map, Place, SuccessResponse } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { locationTable,  placeTable,  } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';

export const placeRouter = new Hono<Context>()
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
      const place = await db.query.placeTable.findFirst({
        where: eq(placeTable.id, id),
      
      });

      if (!place) {
        throw new HTTPException(404, {
          message: 'place not found',
        });
      }

      return c.json<SuccessResponse<Place>>({
        message: 'place fetched!',
        success: true,
        data: place,
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
      const place = await db.query.placeTable.findFirst({
        where: eq(placeTable.id, id),
      });
      if (!place) {
        throw new HTTPException(404, {
          message: 'place not found',
        });
      }

      const locationHeroes = await db.query.locationTable.findMany({
        with: { hero: true },
        where: eq(locationTable.placeId, id),
      });

      const onlineLocationHeroes = locationHeroes.filter((l) => l.hero?.isOnline);

      return c.json<SuccessResponse<Location[]>>({
        message: 'location heroes fetched!',
        success: true,
        data: onlineLocationHeroes,
      });
    },
  );

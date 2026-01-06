import type { HeroSidebarItem, SuccessResponse, TPlace } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, locationTable } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';
import { placeData } from '../data/place-template';

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
      const place = placeData.find((p) => p.id === id);
      if (!place) {
        throw new HTTPException(404, {
          message: 'place not found',
        });
      }

      return c.json<SuccessResponse<TPlace>>({
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
      const place = placeData.find((p) => p.id === id);
      if (!place) {
        throw new HTTPException(404, {
          message: 'place not found',
        });
      }

      const placeHeroes = await db
        .select({
          id: heroTable.id,
          name: heroTable.name,
          level: heroTable.level,
          state: heroTable.state,
          avatarImage: heroTable.avatarImage,
          // x: locationTable.x,
          // y: locationTable.y,
          // placeId: locationTable.placeId,
        })
        .from(heroTable)
        .innerJoin(locationTable, eq(locationTable.heroId, heroTable.id))
        .where(and(eq(locationTable.placeId, place.id), eq(heroTable.isOnline, true)));

      return c.json<SuccessResponse<HeroSidebarItem[]>>({
        message: 'place heroes fetched!',
        success: true,
        data: placeHeroes,
      });
    },
  );

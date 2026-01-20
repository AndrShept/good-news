import { mapTemplate } from '@/shared/templates/map-template';
import type { MapHero, SuccessResponse, TMap } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, locationTable } from '../db/schema';
import { serverState } from '../game/state/server-state';
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

      const map = mapTemplate.find((m) => m.id === id);
      if (!map) {
        throw new HTTPException(404, {
          message: 'map not found',
        });
      }

      return c.json<SuccessResponse<TMap>>({
        message: 'map fetched!',
        success: true,
        data: map,
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
      const map = mapTemplate.find((m) => m.id === id);
      if (!map) {
        throw new HTTPException(404, {
          message: 'map not found',
        });
      }

      // const mapHeroes = await db
      //   .select({
      //     id: heroTable.id,
      //     name: heroTable.name,
      //     state: heroTable.state,
      //     level: heroTable.level,
      //     avatarImage: heroTable.avatarImage,
      //     characterImage: heroTable.characterImage,
      //     x: locationTable.x,
      //     y: locationTable.y,
      //   })
      //   .from(heroTable)
      //   .innerJoin(locationTable, eq(locationTable.heroId, heroTable.id))
      //   .where(and(eq(locationTable.mapId, map.id), eq(heroTable.isOnline, true)));

      let heroesData: MapHero[] = [];

      for (const [heroId, hero] of serverState.hero.entries()) {
        if (hero.location.mapId === id) {
          heroesData.push({ id: hero.id, avatarImage: hero.avatarImage, characterImage: hero.characterImage, level: hero.level, name: hero.name, state: hero.state, x: hero.location.x, y: hero.location.y })
        }
      }
      return c.json<SuccessResponse<MapHero[]>>({
        message: 'map  heroes fetched!',
        success: true,
        data: heroesData,
      });
    },
  );

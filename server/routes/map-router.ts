import { mapTemplate } from '@/shared/templates/map-template';
import type { MapHero, SuccessResponse, TMap } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { getHero } from '../../frontend/src/features/hero/api/get-hero';
import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, locationTable } from '../db/schema';
import { serverState } from '../game/state/server-state';
import { loggedIn } from '../middleware/loggedIn';
import { heroService } from '../services/hero-service';
import { mapService } from '../services/map-service';

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
    '/:id/entities',
    loggedIn,
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const userId = c.get('user')?.id;
      const heroId = serverState.user.get(userId ?? '');
      if (!heroId) throw new HTTPException(400, { message: 'hero id not found' });
      const map = mapTemplate.find((m) => m.id === id);
      const hero = heroService.getHero(heroId);
      if (!map) {
        throw new HTTPException(404, {
          message: 'map not found',
        });
      }


      const chunkId = mapService.getChunkId({ mapId: map.id, x: hero.location.x, y: hero.location.y });
      const chunk = serverState.mapChunks.get(chunkId);
      const heroes = [...(chunk?.heroes ?? [])].map((id) => heroService.getHeroMapData(id));
      const creatures = [...(chunk?.creatures ?? [])].map((id) => serverState.creature.get(id)).filter((i) => !!i);
      const corpses = [...(chunk?.corpses ?? [])].map((id) => serverState.corpse.get(id)).filter((i) => !!i);
      const returnData = {
        heroes,
        creatures,
        corpses,
      };
      return c.json<SuccessResponse<typeof returnData>>({
        message: 'map  entities fetched!',
        success: true,
        data: returnData,
      });
    },
  );

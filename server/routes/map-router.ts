import { MAP_CHUNK_SIZE } from '@/shared/constants';
import { mapTemplate } from '@/shared/templates/map-template';
import { placeTemplate } from '@/shared/templates/place-template';
import type { Corpse, MapHero, SuccessResponse, TMap, TPlace } from '@/shared/types';
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
      const userId = c.get('user')?.id;
      const heroId = serverState.user.get(userId ?? '');
      if (!heroId) throw new HTTPException(400, { message: 'hero id not found' });
      const hero = heroService.getHero(heroId);
      const map = mapTemplate.find((m) => m.id === id);
      if (!map) {
        throw new HTTPException(404, {
          message: 'map not found',
        });
      }
      const chunkX = Math.floor(hero.location.x / MAP_CHUNK_SIZE);
      const chunkY = Math.floor(hero.location.y / MAP_CHUNK_SIZE);

      const startX = Math.max((chunkX - 1) * MAP_CHUNK_SIZE, 0);
      const startY = Math.max((chunkY - 1) * MAP_CHUNK_SIZE, 0);

      const endX = Math.min((chunkX + 2) * MAP_CHUNK_SIZE, map.width);
      const endY = Math.min((chunkY + 2) * MAP_CHUNK_SIZE, map.height);

      const sliceWidth = endX - startX;
      const sliceHeight = endY - startY;

      const placesByChunkId = placeTemplate.map((p) => {
        const chunkId = mapService.getChunkId({ x: p.x, y: p.y, mapId: p.mapId });
        return {
          ...p,
          chunkId,
        };
      });

      const chunkAroundHero = mapService.getAroundChunkIds({ x: hero.location.x, y: hero.location.y, mapId: hero.location.mapId! });

      const copyMap = { ...map };

      copyMap.places = placesByChunkId.filter((p) => chunkAroundHero.includes(p.chunkId));

      copyMap.layers = copyMap.layers.map((l) =>
        l.data
          ? {
              ...l,
              data: mapService.sliceChunksLayerData({
                data: l.data,
                sliceHeight,
                sliceWidth,
                startX,
                startY,
                width: map.width,
              }),
            }
          : l,
      );

      copyMap.width = sliceWidth;
      copyMap.height = sliceHeight;
      copyMap.offsetX = startX;
      copyMap.offsetY = startY;

      return c.json<SuccessResponse<TMap>>({
        message: 'map fetched!',
        success: true,
        data: copyMap,
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
      const hero = heroService.getHero(heroId);
      const map = mapTemplate.find((m) => m.id === id);
      if (!map) {
        throw new HTTPException(404, {
          message: 'map not found',
        });
      }

      const chunkIds = mapService.getAroundChunkIds({ mapId: map.id, x: hero.location.x, y: hero.location.y });
      const returnData = mapService.getMapEntitiesByChunkIds(chunkIds);


      return c.json<SuccessResponse<typeof returnData>>({
        message: 'map  entities fetched!',
        success: true,
        data: returnData,
      });
    },
  );

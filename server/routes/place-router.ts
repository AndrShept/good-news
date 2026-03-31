import { placeTemplate } from '@/shared/templates/place-template';
import type { HeroSidebarItem, SuccessResponse, TPlace } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { heroTable, itemContainerTable, locationTable } from '../db/schema';
import { serverState } from '../game/state/server-state';
import { loggedIn } from '../middleware/loggedIn';
import { heroService } from '../services/hero-service';

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
      const userId = c.get('user')?.id;
      const heroId = serverState.user.get(userId ?? '');
      if (!heroId) throw new HTTPException(400, { message: 'hero id not found' });

      const place = placeTemplate.find((p) => p.id === id);
      if (!place) {
        throw new HTTPException(404, {
          message: 'place not found',
        });
      }
      const containers = Array.from(serverState.container.values());

      let itemContainers = containers
        .filter((i) => i.placeId === place.id && i.heroId === heroId)
        .map((c) => ({ id: c.id, color: c.color, name: c.name, type: c.type }));

      if (!itemContainers.length) {
        console.log('LOADING PLACE CONTAINER');
        const dbContainers = await db.query.itemContainerTable.findMany({
          where: and(eq(itemContainerTable.heroId, heroId), eq(itemContainerTable.placeId, place.id)),
          with: { itemsInstance: true },
        });
        for (const container of dbContainers) {
          serverState.container.set(container.id, container);
        }
        itemContainers = dbContainers.map((c) => ({ id: c.id, color: c.color, name: c.name, type: c.type }));
      }

      return c.json<SuccessResponse<TPlace>>({
        message: 'place fetched!',
        success: true,
        data: { ...place, itemContainers },
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
      const place = placeTemplate.find((p) => p.id === id);
      if (!place) {
        throw new HTTPException(404, {
          message: 'place not found',
        });
      }

      let heroesData: HeroSidebarItem[] = [];

      for (const hero of serverState.hero.values()) {
        if (hero.location.placeId === id) {
          heroesData.push({
            id: hero.id,
            avatarImage: hero.avatarImage,
            level: hero.level,
            name: hero.name,
            state: hero.state,
          });
        }
      }

      return c.json<SuccessResponse<HeroSidebarItem[]>>({
        message: 'place heroes fetched!',
        success: true,
        data: heroesData,
      });
    },
  );

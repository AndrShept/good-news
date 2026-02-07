import { placeTemplate } from '@/shared/templates/place-template';
import type { HeroSidebarItem, SuccessResponse, TPlace } from '@/shared/types';
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
      const place = placeTemplate.find((p) => p.id === id);
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

import type { Location, Map, SuccessResponse, Town } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { locationTable, mapNameTypeEnum, mapTable, tileTable, townTable } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';

export const townRouter = new Hono<Context>()
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
      const town = await db.query.townTable.findFirst({
        where: eq(townTable.id, id),
        with: {
          buildings: {
            with: {
              building: true,
            },
          },
        },
      });

      if (!town) {
        throw new HTTPException(404, {
          message: 'Town not found',
        });
      }

      return c.json<SuccessResponse<Town>>({
        message: 'town fetched!',
        success: true,
        data: town,
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
      const town = await db.query.townTable.findFirst({
        where: eq(townTable.id, id),
      });
      if (!town) {
        throw new HTTPException(404, {
          message: 'town not found',
        });
      }

      const locationHeroes = await db.query.locationTable.findMany({
        with: { hero: true },
        where: eq(locationTable.townId, id),
      });

      const onlineLocationHeroes = locationHeroes.filter((l) => l.hero?.isOnline);

      return c.json<SuccessResponse<Location[]>>({
        message: 'location heroes fetched!',
        success: true,
        data: onlineLocationHeroes,
      });
    },
  );

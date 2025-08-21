import type { Map, SuccessResponse, Town } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { mapNameTypeEnum, mapTable, tileTable, townTable } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';

export const townRouter = new Hono<Context>().get(
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

          }
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
      data: town ,
    });
  },
);

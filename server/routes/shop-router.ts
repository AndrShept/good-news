import type { GameItem, SuccessResponse } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { gameItemTable } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';

export const shopRouter = new Hono<Context>()
  .get('/', loggedIn, async (c) => {
    const shopItems = await db.query.gameItemTable.findMany({
      with: {
        modifier: true,
      },
      orderBy: asc(gameItemTable.id),
    });

    return c.json<SuccessResponse<GameItem[]>>({
      message: 'items fetched!',
      success: true,
      data: shopItems,
    });
  })
  

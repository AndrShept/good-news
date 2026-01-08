import { type ItemTemplate, type SuccessResponse, buildingValues } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { itemTemplateTable } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';

export const shopRouter = new Hono<Context>().get(
  '/:buildingType',
  loggedIn,
  zValidator(
    'param',
    z.object({
      buildingType: z.enum(buildingValues),
    }),
  ),
  async (c) => {
    const { buildingType } = c.req.valid('param');
    // let shopItems: ItemTemplate[] = [];
    // if (buildingType === 'MAGIC-SHOP') {
    //   shopItems = await db.query.itemTemplateTable.findMany({
    //     where: eq(itemTemplateTable.type, 'POTION'),
    //     orderBy: asc(itemTemplateTable.type),
    //   });
    // } else {
    //   shopItems = await db.query.itemTemplateTable.findMany({
    //     orderBy: asc(itemTemplateTable.type),
    //   });
    // }
    const shopItems = await db.query.itemTemplateTable.findMany({
      orderBy: asc(itemTemplateTable.type),
    });

    return c.json<SuccessResponse<ItemTemplate[]>>({
      message: 'items fetched!',
      success: true,
      data: shopItems,
    });
  },
);

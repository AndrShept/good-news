import { type ItemTemplate, type SuccessResponse, buildingValues } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { asc, desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { loggedIn } from '../middleware/loggedIn';
import { itemTemplateService } from '../services/item-template-service';

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

    const shopItems = itemTemplateService.getAllItemsTemplate();

    return c.json<SuccessResponse<ItemTemplate[]>>({
      message: 'items fetched!',
      success: true,
      data: shopItems,
    });
  },
);

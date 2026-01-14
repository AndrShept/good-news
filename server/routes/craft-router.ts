import { type CraftItem, type ItemTemplate, type SuccessResponse, buildingValues } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { type IMaterialModifierConfig, materialModifierConfig } from '../lib/config/material-modifier-config';
import { loggedIn } from '../middleware/loggedIn';
import { ItemTemplateService } from '../services/item-template-service';

export const craftRouter = new Hono<Context>().get(
  '/items/:buildingType',
  zValidator(
    'param',
    z.object({
      buildingType: z.enum(buildingValues),
    }),
  ),
  loggedIn,

  async (c) => {
    const { buildingType } = c.req.valid('param');

    let craftItems: CraftItem[] = [];

    // if (buildingType === 'FORGE') {
    //   craftItems = resourceTemplate.filter((r) => r.craftInfo?.requiredBuildingType === 'FORGE');
    // }
    // if (buildingType === 'BLACKSMITH') {
    //   craftItems = ItemTemplateService.getAllItemsTemplate().filter((t) => t.craftInfo?.requiredBuildingType === 'BLACKSMITH');
    // }

    return c.json<SuccessResponse<CraftItem[]>>({
      message: 'craft item fetched!',
      success: true,
      data: craftItems,
    });
  },
);
// .get(
//   '/data',

//   loggedIn,

//   async (c) => {
//     return c.json<SuccessResponse<{ resourceTemplate: ItemTemplateInsert[]; craftConfig: ICraftConfig; materialModifierConfig: IMaterialModifierConfig }>>(
//       {
//         message: 'craft item fetched!',
//         success: true,
//         data: { resourceTemplate, craftConfig, materialModifierConfig },
//       },
//     );
//   },
// );

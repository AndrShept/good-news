import { buildingValues, type SuccessResponse } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { type ICraftConfig, craftConfig } from '../../shared/config/craft-config';
import { type IMaterialModifierConfig, materialModifierConfig } from '../../shared/config/material-modifier-config';
import type { Context } from '../context';
import { db } from '../db/db';
import { loggedIn } from '../middleware/loggedIn';

export const craftRouter = new Hono<Context>()
  .get(
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

      // let craftItems: CraftItem[] = [];

      // if (buildingType === 'FORGE') {
      //   craftItems = await db.query.craftItemTable.findMany({
      //     where: eq(craftItemTable.requiredBuildingType, 'FORGE'),
      //     with: { gameItem: { with: { resource: true } } },
      //   });
      // }
      // if (buildingType === 'BLACKSMITH') {
      //   craftItems = await db.query.craftItemTable.findMany({
      //     where: eq(craftItemTable.requiredBuildingType, 'BLACKSMITH'),
      //     with: {
      //       gameItem: { with: { armor: true, weapon: true, shield: true } },
      //     },
      //   });
      // }

      // return c.json<SuccessResponse<CraftItem[]>>({
      //   message: 'craft item fetched!',
      //   success: true,
      //   data: craftItems,
      // });
    },
  )
  .get(
    '/data',

    loggedIn,

    async (c) => {
      // const resources = await db.query.resourceTable.findMany({
      //   with: {
      //     gameItem: true,
      //   },
      // });

      // return c.json<SuccessResponse<{ resources: Resource[]; craftConfig: ICraftConfig; materialModifierConfig: IMaterialModifierConfig }>>(
      //   {
      //     message: 'craft item fetched!',
      //     success: true,
      //     data: { resources, craftConfig, materialModifierConfig },
      //   },
      // );
    },
  );

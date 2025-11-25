import {
  type CraftItem,
  type GameItem,
  type GameItemType,
  type GroupCraftItem,
  type Resource,
  type SuccessResponse,
  type WeaponType,
  buildingTypeValues,
} from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import type { Context } from '../context';
import { db } from '../db/db';
import { craftItemTable } from '../db/schema';
import { loggedIn } from '../middleware/loggedIn';

export const craftItemRouter = new Hono<Context>().get(
  '/:buildingType',
  zValidator(
    'param',
    z.object({
      buildingType: z.enum(buildingTypeValues),
    }),
  ),
  loggedIn,

  async (c) => {
    const { buildingType } = c.req.valid('param');

    const resources = await db.query.resourceTable.findMany({
      with: {
        gameItem: true,
        modifier: true,
      },
    });

    if (buildingType === 'FORGE') {
      const forgeItems = await db.query.craftItemTable.findMany({
        where: eq(craftItemTable.baseCraftResource, 'ORE'),
        with: { gameItem: { with: { resource: true } } },
      });

      return c.json<SuccessResponse<{ craftItems: CraftItem[]; resources: Resource[] }>>({
        message: 'craft item fetched!',
        success: true,
        data: { craftItems: forgeItems, resources },
      });
    }

    const craftItems = await db.query.craftItemTable.findMany({
      where: eq(craftItemTable.baseCraftResource, 'INGOT'),
      with: {
        gameItem: { with: { armor: true, weapon: true } },
      },
    });

    return c.json<SuccessResponse<{ craftItems: CraftItem[]; resources: Resource[] }>>({
      message: 'craft item fetched!',
      success: true,
      data: { craftItems, resources },
    });
  },
);

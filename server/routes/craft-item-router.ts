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
    if (!craftItems.length) throw new HTTPException(404, { message: 'craft items not found !' });
    return c.json<SuccessResponse<{ craftItems: CraftItem[]; resources: Resource[] }>>({
      message: 'craft item fetched!',
      success: true,
      data: { craftItems, resources },
    });
    // const groupObject = Object.groupBy(craftItems, ({ gameItem }) => gameItem?.type);

    // const groupedCraftItems = Object.entries(groupObject).map(([itemType, items]) => {
    //   if (itemType === 'WEAPON') {
    //     const weaponGroups = Object.groupBy(items, ({ gameItem }) => gameItem?.weapon?.weaponType ?? 'SWORD');
    //     return {
    //       itemType,
    //       subgroups: Object.entries(weaponGroups).map(([weaponType, wItems]) => ({
    //         subtype: weaponType,
    //         items: wItems,
    //       })),
    //     };
    //   }

    //   if (itemType === 'ARMOR') {
    //     const armorGroups = Object.groupBy(items, ({ gameItem }) => gameItem?.armor?.slot ?? 'CHESTPLATE');
    //     return {
    //       itemType,
    //       subgroups: Object.entries(armorGroups).map(([armorType, aItems]) => ({
    //         subtype: armorType,
    //         items: aItems,
    //       })),
    //     };
    //   }

    //   return { itemType, items };
    // });

    // return c.json<SuccessResponse<{ craftItems: GroupCraftItem[]; resources: Resource[] }>>({
    //   message: 'craft item fetched!',
    //   success: true,
    //   data: { craftItems: groupedCraftItems as GroupCraftItem[], resources },
    // });
  },
);

import type { CraftItem, GameItem, GameItemType, GroupCraftItem, SuccessResponse, WeaponType } from '@/shared/types';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import type { Context } from '../context';
import { db } from '../db/db';
import { loggedIn } from '../middleware/loggedIn';

export const craftItemRouter = new Hono<Context>().get(
  '/',
  loggedIn,

  async (c) => {
    const craftItems = await db.query.craftItemTable.findMany({
      with: {
        gameItem: { with: { armor: true, weapon: true } },
      },
    });

    const groupObject = Object.groupBy(craftItems, ({ gameItem: { type } }) => type);

    const groupedCraftItems = Object.entries(groupObject).map(([itemType, items]) => {
      if (itemType === 'WEAPON') {
        const weaponGroups = Object.groupBy(items, ({ gameItem: { weapon } }) => weapon?.weaponType ?? 'SWORD');
        return {
          itemType,
          subgroups: Object.entries(weaponGroups).map(([weaponType, wItems]) => ({
            subtype: weaponType,
            items: wItems,
          })),
        };
      }

      if (itemType === 'ARMOR') {
        const armorGroups = Object.groupBy(items, ({ gameItem: { armor } }) => armor?.slot ?? 'CHESTPLATE');
        return {
          itemType,
          subgroups: Object.entries(armorGroups).map(([armorType, aItems]) => ({
            subtype: armorType,
            items: aItems,
          })),
        };
      }

      return { itemType, items };
    });
    console.log(groupedCraftItems);
    return c.json<SuccessResponse<GroupCraftItem[]>>({
      message: 'craft item fetched!',
      success: true,
      data: groupedCraftItems as GroupCraftItem[],
    });
  },
);

import type { CraftItem, GameItem, GameItemType, GroupCraftItem, Resource, SuccessResponse, WeaponType } from '@/shared/types';
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
    const resources = await db.query.resourceTable.findMany({
      with: {
        gameItem: true,
        modifier: true,
      },
    });

    const groupObject = Object.groupBy(craftItems, ({ gameItem }) => gameItem?.type);

    const groupedCraftItems = Object.entries(groupObject).map(([itemType, items]) => {
      if (itemType === 'WEAPON') {
        const weaponGroups = Object.groupBy(items, ({ gameItem }) => gameItem?.weapon?.weaponType ?? 'SWORD');
        return {
          itemType,
          subgroups: Object.entries(weaponGroups).map(([weaponType, wItems]) => ({
            subtype: weaponType,
            items: wItems,
          })),
        };
      }

      if (itemType === 'ARMOR') {
        const armorGroups = Object.groupBy(items, ({ gameItem }) => gameItem?.armor?.slot ?? 'CHESTPLATE');
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

    return c.json<SuccessResponse<{ craftItems: GroupCraftItem[]; resources: Resource[] }>>({
      message: 'craft item fetched!',
      success: true,
      data: { craftItems: groupedCraftItems as GroupCraftItem[], resources },
    });
  },
);

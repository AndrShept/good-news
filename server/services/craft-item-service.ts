import type { CraftItem, CraftItemRequiredResources, GameItem, IngotType, LeatherType, ResourceType } from '@/shared/types';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { craftConfig } from '../config/craft-config';
import type { TDataBase, TTransaction } from '../db/db';
import { containerSlotTable, craftItemTable, resourceTable } from '../db/schema';
import { itemContainerService } from './item-container-service';

export const craftItemService = (db: TTransaction | TDataBase) => ({
  async getCraftItem(craftItemId: string, options?: Parameters<typeof db.query.craftItemTable.findFirst>[0]): Promise<CraftItem> {
    const craftItem = await db.query.craftItemTable.findFirst({
      where: eq(craftItemTable.id, craftItemId),
      ...options,
    });
    if (!craftItem) {
      throw new HTTPException(404, {
        message: 'craft item not found',
      });
    }
    return craftItem;
  },

  getCraftItemRequirement(gameItem: GameItem | undefined | null, coreMaterialType: ResourceType | undefined | null) {
    if (!gameItem) return;

    const { type, name, armor, weapon } = gameItem;

    if (type === 'WEAPON') {
      if (!coreMaterialType) return;
      if (!weapon) {
        console.error('getCraftItemRequirement gameItem.weapon not found ');
        return;
      }

      return craftConfig[type][weapon.weaponType][coreMaterialType as IngotType];
    }
    if (type === 'ARMOR') {
      if (!coreMaterialType) return;
      if (!armor) {
        console.error('getCraftItemRequirement gameItem.armor not found ');
        return;
      }

      return craftConfig[type][armor.type][coreMaterialType as LeatherType | IngotType];
    }
    return craftConfig[type][name];
  },
});

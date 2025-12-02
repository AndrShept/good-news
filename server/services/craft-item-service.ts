import type { CraftItem, GameItem, ResourceType } from '@/shared/types';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { containerSlotTable, craftItemTable, resourceTable } from '../db/schema';
import { craftConfig } from '../entities/craft-config';
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

  getRequiredResources(gameItem: GameItem | undefined | null, coreMaterialType: ResourceType | undefined) {
    if (!gameItem || !coreMaterialType) return undefined;

    const { type, name } = gameItem;

    if (type === 'ARMOR') {
      return craftConfig[type][name][coreMaterialType];
    }

    if (type === 'WEAPON') {
      return craftConfig[type][name][coreMaterialType];
    }
    return craftConfig[type][name];
  },
});

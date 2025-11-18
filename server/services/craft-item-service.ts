import type { ResourceType } from '@/shared/types';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { containerSlotTable, craftItemTable, resourceTable } from '../db/schema';
import { itemContainerService } from './item-container-service';

export const craftItemService = (db: TTransaction | TDataBase) => ({
  async getCraftItem(craftItemId: string, options?: Parameters<typeof db.query.craftItemTable.findFirst>[0]) {
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

  async checkCraftResources(heroId: string, craftItemId: string, resourceType: ResourceType) {
    const [craftItem, craftResource, backpack] = await Promise.all([
      craftItemService(db).getCraftItem(craftItemId),
      db.query.resourceTable.findFirst({ where: eq(resourceTable.type, resourceType) }),
      itemContainerService(db).getHeroBackpack(heroId),
    ]);

    if (!craftResource) {
      throw new HTTPException(404, {
        message: 'craft resource not found',
      });
    }

    for (const requiredResource of craftItem.requiredResources) {
      const inventoryResources = await db.query.containerSlotTable.findMany({
        where: and(eq(containerSlotTable.gameItemId, craftResource.gameItemId), eq(containerSlotTable.itemContainerId, backpack.id)),
      });

      const totalOwnedQuantity = inventoryResources.reduce((acc, item) => acc + item.quantity, 0);

      if (totalOwnedQuantity < requiredResource.quantity) {
        throw new HTTPException(409, {
          message: 'Not enough resources to craft this item',
          cause: { canShow: true },
        });
      }
    }

    return {
      craftItem,
      backpack,
    };
  },
});

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

 
});

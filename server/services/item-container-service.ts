
import { and, eq, sql } from 'drizzle-orm';

import type { TDataBase, TTransaction } from '../db/db';
import { buffTable, containerSlotTable, heroTable, itemContainerTable, modifierTable } from '../db/schema';

export const itemContainerService = (db: TTransaction | TDataBase) => ({
  async incrementUsedSlots(itemContainerId: string) {
    await db
      .update(itemContainerTable)
      .set({
        usedSlots: sql`${itemContainerTable.usedSlots} + 1`,
      })
      .where(eq(itemContainerTable.id, itemContainerId));
  },
  async decrementUsedSlots(itemContainerId: string) {
    await db
      .update(itemContainerTable)
      .set({
        usedSlots: sql`${itemContainerTable.usedSlots} - 1`,
      })
      .where(eq(itemContainerTable.id, itemContainerId));
  },
  async setUsedSlots(itemContainerId: string) {
    const usedSlotsCount = await db.$count(containerSlotTable, eq(containerSlotTable.itemContainerId, itemContainerId));
    await db.update(itemContainerTable).set({ usedSlots: usedSlotsCount }).where(eq(itemContainerTable.id, itemContainerId));
  },
});

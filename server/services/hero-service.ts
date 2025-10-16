import { eq, sql } from 'drizzle-orm';

import type { TDataBase, TTransaction, db } from '../db/db';
import { heroTable } from '../db/schema';

export const heroService = {
  async incrementCurrentInventorySlo(db: TTransaction | TDataBase, heroId: string) {
    await db
      .update(heroTable)
      .set({
        currentInventorySlots: sql`${heroTable.currentInventorySlots} + 1`,
      })
      .where(eq(heroTable.id, heroId));
  },
  async decrementCurrentInventorySlots(db: TTransaction | TDataBase, heroId: string) {
    await db
      .update(heroTable)
      .set({
        currentInventorySlots: sql`${heroTable.currentInventorySlots} - 1`,
      })
      .where(eq(heroTable.id, heroId));
  },

};

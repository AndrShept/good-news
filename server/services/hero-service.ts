import { eq, sql } from 'drizzle-orm';

import type { TDataBase, TTransaction, db } from '../db/db';
import { heroTable } from '../db/schema';

export const heroService = (db: TTransaction | TDataBase) => ({
  async incrementCurrentInventorySlots(heroId: string) {
    await db
      .update(heroTable)
      .set({
        currentInventorySlots: sql`${heroTable.currentInventorySlots} + 1`,
      })
      .where(eq(heroTable.id, heroId));
  },
  async decrementCurrentInventorySlots(heroId: string) {
    await db
      .update(heroTable)
      .set({
        currentInventorySlots: sql`${heroTable.currentInventorySlots} - 1`,
      })
      .where(eq(heroTable.id, heroId));
  },
  async updateHeroTable(heroId: string, updateObj: Partial<typeof heroTable.$inferInsert>) {
    await db.update(heroTable).set(updateObj).where(eq(heroTable.id, heroId));
  },
});

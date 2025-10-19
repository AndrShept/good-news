import { eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

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
  async spendGold(heroId: string, amount: number, heroCurrentGold: number) {
    if (heroCurrentGold < amount) throw new HTTPException(422, { message: 'You don’t have enough gold', cause: { canShow: true } });
    await db
      .update(heroTable)
      .set({ goldCoins: sql`${heroTable.goldCoins} - ${amount}` })
      .where(eq(heroTable.id, heroId));
  },
});

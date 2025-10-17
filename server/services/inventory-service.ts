import { eq, sql } from 'drizzle-orm';

import type { TDataBase, TTransaction } from '../db/db';
import { heroTable, inventoryItemTable } from '../db/schema';
import { heroService } from './hero-service';

export const inventoryService = (db: TDataBase | TTransaction) => ({
  async addInventoryItem(gameItemId: string, heroId: string, quantity: number = 1) {
    const [{ currentInventorySlots, maxInventorySlots }] = await db
      .select({ currentInventorySlots: heroTable.currentInventorySlots, maxInventorySlots: heroTable.maxInventorySlots })
      .from(heroTable)
      .where(eq(heroTable.id, heroId));
    if (currentInventorySlots >= maxInventorySlots) {
      return {
        success: false,
        message: 'Inventory is full',
        status: 409,
      };
    }
    await heroService(db).incrementCurrentInventorySlots( heroId);
    const [newItem] = await db
      .insert(inventoryItemTable)
      .values({
        gameItemId,
        heroId,
        quantity,
      })
      .returning();
    return {
      success: true,
      data: newItem,
    };
  },

  async incrementInventoryItemQuantity(inventoryItemId: string, quantity: number) {
    const [data] = await db
      .update(inventoryItemTable)
      .set({
        quantity: sql`${inventoryItemTable.quantity} + ${quantity}`,
      })
      .where(eq(inventoryItemTable.id, inventoryItemId))
      .returning();
    return data;
  },
  async decrementInventoryItemQuantity(inventoryItemId: string) {
    const data = await db
      .update(inventoryItemTable)
      .set({
        quantity: sql`${inventoryItemTable.quantity} - 1`,
      })
      .where(eq(inventoryItemTable.id, inventoryItemId))
      .returning();
    return data;
  },
});

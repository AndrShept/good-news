import { DEFAULT_ITEM_STACK } from '@/shared/constants';
import type { GameItemType } from '@/shared/types';
import { and, eq, lt, lte, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import {  inventoryItemTable } from '../db/schema';
import { heroService } from './hero-service';

interface IAddInventoryItem {
  gameItemId: string;
  heroId: string;
  quantity: number;
  currentInventorySlots: number;
  maxInventorySlots: number;
}
interface IObtainInventoryItem {
  gameItemType: GameItemType;
  gameItemId: string;
  quantity: number;
  heroId: string;
  currentInventorySlots: number;
  maxInventorySlots: number;
}

export const inventoryService = (db: TDataBase | TTransaction) => ({
  async addInventoryItem({ currentInventorySlots, maxInventorySlots, gameItemId, heroId, quantity = 1 }: IAddInventoryItem) {
    if (currentInventorySlots >= maxInventorySlots) {
      throw new HTTPException(409, { message: 'Inventory is full', cause: { canShow: true } });
    }
    await heroService(db).incrementCurrentInventorySlots(heroId);
    const [newItem] = await db
      .insert(inventoryItemTable)
      .values({
        gameItemId,
        heroId,
        quantity,
      })
      .returning();
    return {
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
  async decrementInventoryItemQuantity(inventoryItemId: string, heroId: string, quantity: number) {
    if (quantity > 1) {
      await db
        .update(inventoryItemTable)
        .set({
          quantity: sql`${inventoryItemTable.quantity} - 1`,
        })
        .where(eq(inventoryItemTable.id, inventoryItemId));
    } else {
      await db.delete(inventoryItemTable).where(eq(inventoryItemTable.id, inventoryItemId));
      await heroService(db).decrementCurrentInventorySlots(heroId);
    }
  },

  async obtainInventoryItem({
    currentInventorySlots,
    gameItemId,
    gameItemType,
    heroId,
    maxInventorySlots,
    quantity,
  }: IObtainInventoryItem) {
    if (gameItemType !== 'ARMOR' && gameItemType !== 'WEAPON') {
      const inventoryItem = await db.query.inventoryItemTable.findFirst({
        where: and(
          eq(inventoryItemTable.gameItemId, gameItemId),
          eq(inventoryItemTable.heroId, heroId),
          lte(inventoryItemTable.quantity, DEFAULT_ITEM_STACK - quantity),
        ),
      });
      if (inventoryItem) {
        const updatedItem = await this.incrementInventoryItemQuantity(inventoryItem.id, quantity);

        return { data: updatedItem };
      }
    }

    const newItemResult = await this.addInventoryItem({
      gameItemId,
      heroId,
      currentInventorySlots,
      maxInventorySlots,
      quantity,
    });

    return {
      data: newItemResult.data,
    };
  },
});

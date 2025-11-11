import { DEFAULT_ITEM_STACK } from '@/shared/constants';
import type { GameItemType } from '@/shared/types';
import { and, eq, lt, lte, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { containerSlotTable } from '../db/schema';
import { itemContainerService } from './item-container-service';

interface ICreateContainerSlotItem {
  gameItemId: string;
  quantity: number;
  currentInventorySlots: number;
  maxInventorySlots: number;
  itemContainerId: string;
}
interface IObtainInventoryItem {
  gameItemType: GameItemType;
  gameItemId: string;
  quantity: number;
  itemContainerId: string;
  currentInventorySlots: number;
  maxInventorySlots: number;
}

export const inventoryService = (db: TDataBase | TTransaction) => ({
  async createContainerSlotItem({
    currentInventorySlots,
    maxInventorySlots,
    gameItemId,
    quantity = 1,
    itemContainerId,
  }: ICreateContainerSlotItem) {
    if (currentInventorySlots >= maxInventorySlots) {
      throw new HTTPException(409, { message: 'Inventory is full', cause: { canShow: true } });
    }
    const [newItem] = await db
      .insert(containerSlotTable)
      .values({
        gameItemId,
        quantity,
        itemContainerId,
      })
      .returning();
    await itemContainerService(db).setUsedSlots(itemContainerId);

    return {
      data: newItem,
    };
  },

  async incrementContainerSlotItemQuantity(containerSlotId: string, quantity: number) {
    const [data] = await db
      .update(containerSlotTable)
      .set({
        quantity: sql`${containerSlotTable.quantity} + ${quantity}`,
      })
      .where(eq(containerSlotTable.id, containerSlotId))
      .returning();
    return data;
  },
  async decrementContainerSlotItemQuantity(inventoryItemId: string, itemContainerId: string, quantity: number) {
    if (quantity > 1) {
      await db
        .update(containerSlotTable)
        .set({
          quantity: sql`${containerSlotTable.quantity} - 1`,
        })
        .where(eq(containerSlotTable.id, inventoryItemId));
    } else {
      await db.delete(containerSlotTable).where(eq(containerSlotTable.id, inventoryItemId));
      await itemContainerService(db).setUsedSlots(itemContainerId);
    }
  },

  async obtainInventoryItem({
    currentInventorySlots,
    gameItemId,
    gameItemType,
    itemContainerId,
    maxInventorySlots,
    quantity,
  }: IObtainInventoryItem) {
    if (gameItemType !== 'ARMOR' && gameItemType !== 'WEAPON') {
      const inventoryItem = await db.query.containerSlotTable.findFirst({
        where: and(
          eq(containerSlotTable.gameItemId, gameItemId),
          eq(containerSlotTable.itemContainerId, itemContainerId),
          lte(containerSlotTable.quantity, DEFAULT_ITEM_STACK - quantity),
        ),
      });
      if (inventoryItem) {
        const updatedItem = await this.incrementContainerSlotItemQuantity(inventoryItem.id, quantity);

        return { data: updatedItem };
      }
    }

    const newItemResult = await this.createContainerSlotItem({
      gameItemId,
      currentInventorySlots,
      maxInventorySlots,
      quantity,
      itemContainerId,
    });

    return {
      data: newItemResult.data,
    };
  },
});

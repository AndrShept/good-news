import type { ItemContainerType, QueueCraftItem, QueueCraftStatusType, TItemContainer } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';

import type { TDataBase, TTransaction } from '../db/db';
import { queueCraftItemTable } from '../db/schema';
import { craftItemService } from './craft-item-service';

export const queueCraftItemService = (db: TTransaction | TDataBase) => ({
  async getQueueCraftItemByStatus(
    heroId: string,
    status: QueueCraftStatusType,
    options?: Parameters<typeof db.query.queueCraftItemTable.findFirst>[0],
  ): Promise<QueueCraftItem> {
    const queueCraftItem = await db.query.queueCraftItemTable.findFirst({
      where: and(eq(queueCraftItemTable.heroId, heroId), eq(queueCraftItemTable.status, status)),
      ...options,
    });
    if (!queueCraftItem) throw new Error('queueCraftItem not found');
    return queueCraftItem;
  },
  async getQueueCraftItemById(
    queueCraftItemId: string,
    options?: Parameters<typeof db.query.queueCraftItemTable.findFirst>[0],
  ): Promise<QueueCraftItem> {
    const queueCraftItem = await db.query.queueCraftItemTable.findFirst({
      where: eq(queueCraftItemTable.id, queueCraftItemId),
      ...options,
    });
    if (!queueCraftItem) throw new Error('queueCraftItem not found');
    return queueCraftItem;
  },

  async updateQueueCraftItem(queueCraftItemId: string, updateData: Partial<QueueCraftItem>) {
    await db
      .update(queueCraftItemTable)
      .set({ ...updateData })
      .where(eq(queueCraftItemTable.id, queueCraftItemId));
  },

  async setNextQueueCraftItem(heroId: string): Promise<QueueCraftItem | undefined> {
    const next = await this.getQueueCraftItemByStatus(heroId, 'PENDING', {
      with: { craftItem: { with: { gameItem: true } } },
    });
    if (!next) return;
    const requirement = craftItemService(db).getCraftItemRequirement(next.craftItem?.gameItem!, next.coreMaterialType);

    const completedAt = new Date(Date.now() + (requirement?.craftTime ?? 0)).toISOString();

    const [updatedQueueItem] = await db
      .update(queueCraftItemTable)
      .set({
        status: 'PROGRESS',
        completedAt,
      })
      .where(eq(queueCraftItemTable.id, next.id))
      .returning();
    return updatedQueueItem;
  },
});

import type { ItemContainerType } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { buffTable, containerSlotTable, heroTable, itemContainerTable, modifierTable } from '../db/schema';

export const itemContainerService = (db: TTransaction | TDataBase) => ({
  async getHeroBackpack(heroId: string) {
    const heroBackpack = await db.query.itemContainerTable.findFirst({
      where: and(eq(itemContainerTable.heroId, heroId), eq(itemContainerTable.type, 'BACKPACK')),
    });
    if (!heroBackpack) {
      throw new HTTPException(404, {
        message: 'hero Backpack not found',
      });
    }
    return heroBackpack;
  },
  async getItemContainerById(id: string, options?: Parameters<typeof db.query.itemContainerTable.findFirst>[0]) {
    const itemContainer = await db.query.itemContainerTable.findFirst({
      where: eq(itemContainerTable.id, id),
      ...options,
    });
    if (!itemContainer) {
      throw new HTTPException(404, {
        message: 'item Container not found',
      });
    }
    return itemContainer;
  },
  async getHeroItemContainerByType(
    heroId: string,
    type: ItemContainerType,
    options?: Parameters<typeof db.query.itemContainerTable.findFirst>[0],
  ) {
    const itemContainer = await db.query.itemContainerTable.findFirst({
      where: and(eq(itemContainerTable.heroId, heroId), eq(itemContainerTable.type, type)),
      ...options,
    });
    if (!itemContainer) {
      throw new HTTPException(404, {
        message: 'item Container not found',
      });
    }
    return itemContainer;
  },

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

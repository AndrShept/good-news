import type { ContainerSlot, CraftItemRequiredResources, ItemContainerType, ResourceType, TItemContainer } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { buffTable, containerSlotTable, heroTable, itemContainerTable, modifierTable, resourceTable } from '../db/schema';

export const itemContainerService = (db: TTransaction | TDataBase) => ({
  async getHeroBackpack(heroId: string, options?: Parameters<typeof db.query.itemContainerTable.findFirst>[0]): Promise<TItemContainer> {
    const heroBackpack = await db.query.itemContainerTable.findFirst({
      where: and(eq(itemContainerTable.heroId, heroId), eq(itemContainerTable.type, 'BACKPACK')),
      ...options,
    });
    if (!heroBackpack) {
      throw new HTTPException(404, {
        message: 'hero Backpack not found',
      });
    }
    return heroBackpack;
  },
  async getItemContainerById(id: string, options?: Parameters<typeof db.query.itemContainerTable.findFirst>[0]): Promise<TItemContainer> {
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
  async checkCraftResources(heroId: string, requiredResources: CraftItemRequiredResources[] | undefined) {
    const backpack = await itemContainerService(db).getHeroBackpack(heroId);

    if (!requiredResources?.length) {
      throw new HTTPException(404, {
        message: 'requiredResources resource not found',
      });
    }

    for (const requiredResource of requiredResources) {
      const craftResource = await db.query.resourceTable.findFirst({ where: eq(resourceTable.type, requiredResource.type) });
      if (!craftResource) {
        throw new HTTPException(404, {
          message: `not found craftResource`,
        });
      }
      const inventoryResources = await db.query.containerSlotTable.findMany({
        where: and(eq(containerSlotTable.gameItemId, craftResource.gameItemId), eq(containerSlotTable.itemContainerId, backpack.id)),
      });

      const totalOwnedQuantity = inventoryResources.reduce((acc, item) => acc + item.quantity, 0);

      if (totalOwnedQuantity < requiredResource.quantity) {
        throw new HTTPException(409, {
          message: `Not enough resources ${requiredResource.type.toLowerCase()} to craft this item`,
          cause: { canShow: true },
        });
      }
    }

    return {
      backpack,
    };
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

  async consumeResources(itemContainerId: string, requiredResources: CraftItemRequiredResources[], containerSlots: ContainerSlot[]) {
    for (const requiredResource of requiredResources) {
      let requiredQuantity = requiredResource.quantity;

      // знаходимо ВСІ слоти з потрібним типом ресурсу
      const slots = containerSlots.filter((slot) => slot.gameItem?.resource?.type === requiredResource.type);

      if (!slots || slots.length === 0) {
        throw new HTTPException(409, { message: `Not enough ${requiredResource.type}` });
      }

      for (const slot of slots) {
        if (requiredQuantity <= 0) break;

        const take = Math.min(slot.quantity, requiredQuantity);
        const newQuantity = slot.quantity - take;

        if (newQuantity > 0) {
          await db.update(containerSlotTable).set({ quantity: newQuantity }).where(eq(containerSlotTable.id, slot.id));
        } else {
          await db.delete(containerSlotTable).where(eq(containerSlotTable.id, slot.id));
          await itemContainerService(db).setUsedSlots(itemContainerId);
        }

        requiredQuantity -= take;
      }

      if (requiredQuantity > 0) {
        throw new HTTPException(409, { message: `Not enough ${requiredResource.type}` });
      }
    }
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

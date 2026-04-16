import { buildingTemplateById } from '@/shared/templates/building-template';
import { placeTemplate } from '@/shared/templates/place-template';
import type { ItemInstance, ItemLocationType, ItemsInstanceDeltaEvent } from '@/shared/types';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { type DbTransaction, type TDataBase } from '../db/db';
import { itemContainerTable } from '../db/schema';
import { serverState } from '../game/state/server-state';
import { deltaEventsService } from './delta-events-service';
import { heroService } from './hero-service';
import { itemInstanceService } from './item-instance-service';
import { itemTemplateService } from './item-template-service';

interface ICreateItem {
  itemContainerId: string;
  itemTemplateId: string;
  quantity: number;
  heroId: string;
  coreResourceId: string | undefined;
  isAddPendingEvents: boolean;
}

interface ObtainStackableItem {
  quantity: number;
  itemContainerId: string;
  itemTemplateId: string;
  targetItemInstanceId?: string;
  heroId: string;
  location: ItemLocationType;
}
function findContainer(type: string, heroId: string, placeId: string) {
  return Array.from(serverState.container.values()).find((c) => c.type === type && c.ownerId === heroId && c.placeId === placeId);
}

export const itemContainerService = {
  getContainer(containerId: string) {
    const container = serverState.container.get(containerId);
    if (!container) {
      throw new HTTPException(404, { message: 'container  not found' });
    }
    return container;
  },
  getBackpack(heroId: string) {
    const hero = heroService.getHero(heroId);
    const backpackId = hero.itemContainers.find((c) => c.type === 'BACKPACK')?.id;
    if (!backpackId) {
      throw new HTTPException(404, { message: 'backpackId  not found' });
    }
    const backpack = this.getContainer(backpackId);
    return backpack;
  },

  async createPlaceContainers(db: DbTransaction, placeId: string, heroId: string) {
    const place = placeTemplate.find((p) => p.id === placeId);
    if (!place) {
      throw new HTTPException(400, { message: 'place not found' });
    }
    const buildings = place.buildingIds.map((id) => buildingTemplateById[id]);
    for (const building of buildings) {
      switch (building.key) {
        case 'BANK': {
          const container =
            findContainer('BANK', heroId, placeId) ??
            (await db.query.itemContainerTable.findFirst({
              where: and(
                eq(itemContainerTable.type, 'BANK'),
                eq(itemContainerTable.ownerId, heroId),
                eq(itemContainerTable.placeId, placeId),
              ),
              with: { itemsInstance: true },
            }));
          if (!container) {
            const [newContainer] = await db
              .insert(itemContainerTable)
              .values({ ownerId: heroId, placeId: place.id, name: '1', type: 'BANK' })
              .returning();
            serverState.container.set(newContainer.id, { ...newContainer, itemsInstance: [] });
          }
          break;
        }
        case 'FORGE': {
          const container =
            findContainer('FORGE', heroId, placeId) ??
            (await db.query.itemContainerTable.findFirst({
              where: and(
                eq(itemContainerTable.type, 'FORGE'),
                eq(itemContainerTable.ownerId, heroId),
                eq(itemContainerTable.placeId, placeId),
              ),
              with: { itemsInstance: true },
            }));
          if (!container) {
            const [newContainer] = await db
              .insert(itemContainerTable)
              .values({ ownerId: heroId, placeId: place.id, name: 'forge', type: 'FORGE', capacity: 5 })
              .returning();
            serverState.container.set(newContainer.id, { ...newContainer, itemsInstance: [] });
          }
          break;
        }
        case 'LOOM': {
          const container =
            findContainer('LOOM', heroId, placeId) ??
            (await db.query.itemContainerTable.findFirst({
              where: and(
                eq(itemContainerTable.type, 'LOOM'),
                eq(itemContainerTable.ownerId, heroId),
                eq(itemContainerTable.placeId, placeId),
              ),
              with: { itemsInstance: true },
            }));
          if (!container) {
            const [newContainer] = await db
              .insert(itemContainerTable)
              .values({ ownerId: heroId, placeId: place.id, name: 'loom', type: 'LOOM', capacity: 5 })
              .returning();
            serverState.container.set(newContainer.id, { ...newContainer, itemsInstance: [] });
          }
          break;
        }
        case 'SAWMILL': {
          const container =
            findContainer('SAWMILL', heroId, placeId) ??
            (await db.query.itemContainerTable.findFirst({
              where: and(
                eq(itemContainerTable.type, 'SAWMILL'),
                eq(itemContainerTable.ownerId, heroId),
                eq(itemContainerTable.placeId, placeId),
              ),
              with: { itemsInstance: true },
            }));
          if (!container) {
            const [newContainer] = await db
              .insert(itemContainerTable)
              .values({ ownerId: heroId, placeId: place.id, name: 'sawmill', type: 'SAWMILL', capacity: 5 })
              .returning();
            serverState.container.set(newContainer.id, { ...newContainer, itemsInstance: [] });
          }
          break;
        }
        case 'TANNERY': {
          const container =
            findContainer('TANNERY', heroId, placeId) ??
            (await db.query.itemContainerTable.findFirst({
              where: and(
                eq(itemContainerTable.type, 'TANNERY'),
                eq(itemContainerTable.ownerId, heroId),
                eq(itemContainerTable.placeId, placeId),
              ),
              with: { itemsInstance: true },
            }));
          if (!container) {
            const [newContainer] = await db
              .insert(itemContainerTable)
              .values({ ownerId: heroId, placeId: place.id, name: 'tannery', type: 'TANNERY', capacity: 5 })
              .returning();
            serverState.container.set(newContainer.id, { ...newContainer, itemsInstance: [] });
          }
          break;
        }
      }
    }
  },

  deleteItem(itemContainerId: string, itemInstanceId: string) {
    const container = this.getContainer(itemContainerId);

    const findIndex = container.itemsInstance.findIndex((i) => i.id === itemInstanceId);
    if (findIndex === -1) throw new HTTPException(404, { message: 'removeItem findIndex not found' });
    container.itemsInstance.splice(findIndex, 1);
  },
  checkFreeContainerCapacity(containerId: string) {
    const container = this.getContainer(containerId);

    if (container.capacity <= container.itemsInstance.length) {
      throw new HTTPException(409, { message: 'Container is full!', cause: { canShow: true } });
    }
  },
  checkRequirementsItems(heroId: string, itemTemplateId: string, quantity: number) {
    const backpack = this.getBackpack(heroId);
    const template = itemTemplateService.getAllItemsTemplateMapIds()[itemTemplateId];
    const amount = backpack.itemsInstance.reduce((acc, item) => {
      if (item.itemTemplateId === itemTemplateId) {
        acc += item.quantity;
      }
      return acc;
    }, 0);
    if (amount < quantity) throw new HTTPException(409, { message: `Not enough ${template.name}.`, cause: { canShow: true } });
  },

  createItem({ itemContainerId, heroId, itemTemplateId, quantity, coreResourceId, isAddPendingEvents }: ICreateItem) {
    const templateById = itemTemplateService.getAllItemsTemplateMapIds();
    const template = templateById[itemTemplateId];
    const location = 'BACKPACK';
    let result: ItemsInstanceDeltaEvent[] = [];
    if (!template.stackable) {
      for (let i = 0; i < quantity; i++) {
        const newItem = itemInstanceService.createItem({
          heroId,
          itemContainerId,
          itemTemplateId,
          quantity: 1,
          location,
          coreResourceId,
          isAddPendingEvents,
        });
        result.push({ type: 'CREATE', itemContainerId, item: newItem });
      }

      return result;
    }
    result = this.obtainStackableItem({ heroId, itemContainerId, itemTemplateId, location, quantity });
    return result;
  },
  obtainStackableItem({ heroId, itemContainerId, itemTemplateId, location, quantity, targetItemInstanceId }: ObtainStackableItem) {
    const container = itemContainerService.getContainer(itemContainerId);

    const template = itemTemplateService.getTemplateByItemTemplateId(itemTemplateId);
    const resultData: ItemsInstanceDeltaEvent[] = [];
    if (targetItemInstanceId) {
      const targetItemTemplate = itemTemplateService.getTemplateByItemTemplateId(itemTemplateId);
      const targetItem = container.itemsInstance.find((i) => i.id === targetItemInstanceId);
      if (targetItem) {
        const space = targetItemTemplate.maxStack! - targetItem.quantity;
        const add = Math.min(space, quantity);
        targetItem.quantity += add;
        quantity -= add;
        resultData.push({ type: 'UPDATE', itemContainerId, itemInstanceId: targetItem.id, updateData: { quantity: targetItem.quantity } });
        deltaEventsService.itemInstance.update(targetItem.id, { quantity: targetItem.quantity });
      }
    }
    if (!quantity) return resultData;
    let remaining = quantity;

    // 1️⃣ Заповнюємо існуючі стеки
    for (const inst of container.itemsInstance) {
      if (inst.itemTemplateId !== itemTemplateId) continue;

      const space = (template.maxStack ?? 1) - inst.quantity;
      if (space <= 0) continue;

      const add = Math.min(space, remaining);
      inst.quantity += add;
      resultData.push({ type: 'UPDATE', itemContainerId, itemInstanceId: inst.id, updateData: { quantity: inst.quantity } });
      deltaEventsService.itemInstance.update(inst.id, { quantity: inst.quantity });

      remaining -= add;

      if (remaining === 0) return resultData;
    }

    // 2️⃣ Створюємо нові стеки
    while (remaining > 0) {
      const stackQty = Math.min(template.maxStack ?? 1, remaining);
      const newItem = itemInstanceService.createItem({
        heroId,
        itemContainerId,
        itemTemplateId,
        quantity: stackQty,
        location,
        coreResourceId: undefined,
        isAddPendingEvents: true,
      });
      resultData.push({ type: 'CREATE', itemContainerId, item: newItem });
      remaining -= stackQty;
    }
    return resultData;
  },

  consumeItem({
    itemContainerId,
    itemInstanceId,
    quantity,
    mode,
  }: {
    itemContainerId: string;
    itemInstanceId: string;
    quantity: number;
    mode: 'use' | 'all';
  }) {
    const container = this.getContainer(itemContainerId);
    const itemInstance = itemInstanceService.getItemInstance(itemContainerId, itemInstanceId);
    const template = itemTemplateService.getAllItemsTemplateMapIds()[itemInstance.itemTemplateId];
    const resultData: ItemsInstanceDeltaEvent[] = [];
    // ❌ non-stackable
    if (!template.stackable) {
      itemContainerService.deleteItem(itemContainerId, itemInstanceId);
      resultData.push({ type: 'DELETE', itemContainerId, itemInstanceId, itemName: template.name });
      deltaEventsService.itemInstance.delete(itemInstanceId);
      return resultData;
    }

    // 🧪 USE MODE — тільки один стек
    if (mode === 'use') {
      if (itemInstance.quantity < quantity) {
        throw new Error('Not enough items in this stack');
      }

      itemInstance.quantity -= quantity;

      if (itemInstance.quantity <= 0) {
        itemContainerService.deleteItem(itemContainerId, itemInstance.id);
        resultData.push({ type: 'DELETE', itemContainerId, itemInstanceId, itemName: template.name });
        deltaEventsService.itemInstance.delete(itemInstanceId);
      } else {
        resultData.push({ type: 'UPDATE', itemContainerId, itemInstanceId, updateData: { quantity: itemInstance.quantity } });
        deltaEventsService.itemInstance.update(itemInstanceId, { quantity: itemInstance.quantity });
      }

      return resultData;
    }

    // 🏗 CRAFT MODE — можна брати з усіх стеків
    let remaining = quantity;

    // 1️⃣ клікнутий перший
    const takeFirst = Math.min(itemInstance.quantity, remaining);
    itemInstance.quantity -= takeFirst;
    remaining -= takeFirst;

    if (itemInstance.quantity <= 0) {
      itemContainerService.deleteItem(itemContainerId, itemInstance.id);
      resultData.push({ type: 'DELETE', itemContainerId, itemInstanceId, itemName: template.name });
      deltaEventsService.itemInstance.delete(itemInstanceId);
    } else {
      resultData.push({ type: 'UPDATE', itemContainerId, itemInstanceId, updateData: { quantity: itemInstance.quantity } });
      deltaEventsService.itemInstance.update(itemInstanceId, { quantity: itemInstance.quantity });
    }

    // 2️⃣ інші
    for (const inst of container.itemsInstance) {
      if (remaining === 0) break;
      if (inst.itemTemplateId !== template.id) continue;
      if (inst.id === itemInstance.id) continue;

      const take = Math.min(inst.quantity, remaining);
      inst.quantity -= take;
      remaining -= take;

      if (inst.quantity <= 0) {
        itemContainerService.deleteItem(itemContainerId, inst.id);
        resultData.push({ type: 'DELETE', itemContainerId, itemInstanceId: inst.id, itemName: '' });
        deltaEventsService.itemInstance.delete(inst.id);
      } else {
        resultData.push({ type: 'UPDATE', itemContainerId, itemInstanceId: inst.id, updateData: { quantity: inst.quantity } });
        deltaEventsService.itemInstance.update(itemInstanceId, { quantity: inst.quantity });
      }
    }

    if (remaining > 0) {
      throw new Error('Not enough items');
    }
    return resultData;
  },
};

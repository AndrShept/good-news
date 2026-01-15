import type { ItemInstance } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { heroService } from './hero-service';
import { itemInstanceService } from './item-instance-service';
import { itemTemplateService } from './item-template-service';

interface IObtainItem {
  itemContainerId: string;
  itemTemplateId: string;
  quantity: number;
  heroId: string;
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
  addItem(itemContainerId: string, itemInstance: ItemInstance) {
    const container = this.getContainer(itemContainerId);
    container.itemsInstance.push(itemInstance);
  },
  removeItem(itemContainerId: string, itemInstanceId: string) {
    const container = this.getContainer(itemContainerId);

    const findIndex = container.itemsInstance.findIndex((i) => i.id === itemInstanceId);
    if (findIndex === -1) throw new HTTPException(404, { message: 'removeItem findIndex not found' });
    container.itemsInstance.splice(findIndex, 1);
  },
  checkFreeContainerCapacity(containerId: string) {
    const container = this.getContainer(containerId);

    if (container.capacity <= container.itemsInstance.length) {
      throw new HTTPException(409, { message: 'Container is full!' });
    }
  },

  obtainItem({ itemContainerId, heroId, itemTemplateId, quantity }: IObtainItem) {
    const container = this.getContainer(itemContainerId);
    const templateById = itemTemplateService.getAllItemsTemplateMapIds();
    const template = templateById[itemTemplateId];
    const location = container.type === 'BACKPACK' ? 'BACKPACK' : 'BANK';
    if (!template.stackable) {
      for (let i = 0; i < quantity; i++) {
        itemInstanceService.createItem({ heroId, itemContainerId, itemTemplateId, quantity: 1, location });
      }
      return;
    }

    let remaining = quantity;

    // 1️⃣ Заповнюємо існуючі стеки
    for (const inst of container.itemsInstance) {
      if (inst.itemTemplateId !== itemTemplateId) continue;

      const space = (template.maxStack ?? 1) - inst.quantity;
      if (space <= 0) continue;

      const add = Math.min(space, remaining);
      inst.quantity += add;
      remaining -= add;

      if (remaining === 0) return;
    }

    // 2️⃣ Створюємо нові стеки
    while (remaining > 0) {
      const stackQty = Math.min(template.maxStack ?? 1, remaining);
      itemInstanceService.createItem({ heroId, itemContainerId, itemTemplateId, quantity: stackQty, location });
      remaining -= stackQty;
    }
  },
  consumeItem({ itemContainerId, itemInstanceId, quantity }: { itemContainerId: string; itemInstanceId: string; quantity: number }) {
    const container = this.getContainer(itemContainerId);
    const itemInstance = itemInstanceService.getItemInstance(itemContainerId, itemInstanceId);
    const templateById = itemTemplateService.getAllItemsTemplateMapIds();
    const template = templateById[itemInstance.itemTemplateId];

    let remaining = quantity;

    // ❌ non-stackable
    if (!template.stackable) {
      const instances = container.itemsInstance.filter((i) => i.itemTemplateId === template.id);

      if (instances.length < quantity) {
        throw new Error('Not enough items');
      }

      for (let i = 0; i < quantity; i++) {
        itemContainerService.removeItem(itemContainerId, itemInstanceId);
      }

      return;
    }

    // ✅ stackable — знімаємо з існуючих стеків
    for (const inst of container.itemsInstance) {
      if (inst.itemTemplateId !== template.id) continue;

      const take = Math.min(inst.quantity, remaining);
      inst.quantity -= take;
      remaining -= take;

      if (inst.quantity === 0) {
        itemContainerService.removeItem(itemContainerId, itemInstanceId);
      }

      if (remaining === 0) return;
    }

    // ❗ Якщо не вистачило айтемів
    if (remaining > 0) {
      throw new Error('Not enough items');
    }
  },
};

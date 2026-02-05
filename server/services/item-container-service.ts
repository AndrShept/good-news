import type { ItemInstance, ItemLocationType } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { heroService } from './hero-service';
import { itemInstanceService } from './item-instance-service';
import { itemTemplateService } from './item-template-service';

interface ICreateItem {
  itemContainerId: string;
  itemTemplateId: string;
  quantity: number;
  heroId: string;
}

interface IObtainStackableItem {
  quantity: number;
  itemContainerId: string;
  itemTemplateId: string;
  heroId: string;
  location: ItemLocationType;
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

  createItem({ itemContainerId, heroId, itemTemplateId, quantity }: ICreateItem) {
    const container = this.getContainer(itemContainerId);
    const templateById = itemTemplateService.getAllItemsTemplateMapIds();
    const template = templateById[itemTemplateId];
    const location = 'BACKPACK';
    if (!template.stackable) {
      for (let i = 0; i < quantity; i++) {
        itemInstanceService.createItem({ heroId, itemContainerId, itemTemplateId, quantity: 1, location });
      }
      return;
    }
    this.obtainStackableItem({ heroId, itemContainerId, itemTemplateId, location, quantity });
  },
  obtainStackableItem({ heroId, itemContainerId, itemTemplateId, location, quantity }: IObtainStackableItem) {
    const container = itemContainerService.getContainer(itemContainerId);
    const templateById = itemTemplateService.getAllItemsTemplateMapIds();
    const template = templateById[itemTemplateId];

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
  const template = itemTemplateService
    .getAllItemsTemplateMapIds()[itemInstance.itemTemplateId];

  // ❌ non-stackable
  if (!template.stackable) {
    itemContainerService.removeItem(itemContainerId, itemInstanceId);
    return;
  }

  // 🧪 USE MODE — тільки один стек
  if (mode === 'use') {
    if (itemInstance.quantity < quantity) {
      throw new Error('Not enough items in this stack');
    }

    itemInstance.quantity -= quantity;

    if (itemInstance.quantity === 0) {
      itemContainerService.removeItem(itemContainerId, itemInstance.id);
    }

    return;
  }

  // 🏗 CRAFT MODE — можна брати з усіх стеків
  let remaining = quantity;

  // 1️⃣ клікнутий перший
  const takeFirst = Math.min(itemInstance.quantity, remaining);
  itemInstance.quantity -= takeFirst;
  remaining -= takeFirst;

  if (itemInstance.quantity === 0) {
    itemContainerService.removeItem(itemContainerId, itemInstance.id);
  }

  // 2️⃣ інші
  for (const inst of container.itemsInstance) {
    if (remaining === 0) break;
    if (inst.itemTemplateId !== template.id) continue;
    if (inst.id === itemInstance.id) continue;

    const take = Math.min(inst.quantity, remaining);
    inst.quantity -= take;
    remaining -= take;

    if (inst.quantity === 0) {
      itemContainerService.removeItem(itemContainerId, inst.id);
    }
  }

  if (remaining > 0) {
    throw new Error('Not enough items');
  }
}

};

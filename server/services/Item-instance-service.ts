import type { ItemInstance, ItemLocationType } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { generateRandomUuid } from '../lib/utils';
import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';

interface ICreateItem {
  itemTemplateId: string;
  itemContainerId: string;
  heroId: string;
  quantity: number;
  location: ItemLocationType;
}

export const itemInstanceService = {
  getItemInstance(containerId: string, itemInstanceId: string) {
    const container = itemContainerService.getContainer(containerId);
    const findItemInstance = container.itemsInstance.find((i) => i.id === itemInstanceId);
    if (!findItemInstance) throw new HTTPException(404, { message: 'getItemInstance findItemInstance  not found' });

    return findItemInstance;
  },

  createItem({ heroId, itemContainerId, itemTemplateId, quantity, location }: ICreateItem) {
    heroService.checkFreeBackpackCapacity(heroId);

    const newItem: ItemInstance = {
      id: generateRandomUuid(),
      quantity,
      location,
      itemContainerId,
      itemTemplateId,
      ownerHeroId: heroId,
      marketPrice: null,
      materialModifier: null,
      coreMaterial: null,
      slot: null,
      durability: null,
      createdAt: new Date().toISOString(),
    };
    const container = itemContainerService.getContainer(itemContainerId);
    container.itemsInstance.push(newItem);
  },

  consume() {},

  move() {},
};

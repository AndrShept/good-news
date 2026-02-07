import { resourceTemplateById } from '@/shared/templates/resource-template';
import type { CoreResourceType, ItemInstance, ItemLocationType, OmitModifier } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { materialConfig } from '../../frontend/src/lib/config';
import { materialModifierConfig } from '../lib/config/material-modifier-config';
import { generateRandomUuid, getDisplayName, getModifierByResourceKey } from '../lib/utils';
import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { itemTemplateService } from './item-template-service';

interface ICreateItem {
  itemTemplateId: string;
  itemContainerId: string;
  heroId: string;
  quantity: number;
  location: ItemLocationType;
  coreResourceId: string | undefined;
}

export const itemInstanceService = {
  getItemInstance(containerId: string, itemInstanceId: string) {
    const container = itemContainerService.getContainer(containerId);
    const findItemInstance = container.itemsInstance.find((i) => i.id === itemInstanceId);
    if (!findItemInstance) throw new HTTPException(404, { message: 'getItemInstance findItemInstance  not found' });

    return findItemInstance;
  },

  createItem({ heroId, itemContainerId, itemTemplateId, quantity, location, coreResourceId }: ICreateItem) {
    heroService.checkFreeBackpackCapacity(heroId);
    let coreResource: null | CoreResourceType = null;
    let coreResourceModifier: null | Partial<OmitModifier> = null;
    let displayName: string | null = null;
    if (coreResourceId) {
      const resource = resourceTemplateById[coreResourceId];
      coreResource = resource.key as CoreResourceType;
      coreResourceModifier = getModifierByResourceKey(coreResource, itemTemplateId);
      displayName = getDisplayName(itemTemplateId, resource.id) as string | null;
    }
    const newItem: ItemInstance = {
      id: generateRandomUuid(),
      displayName,
      quantity,
      location,
      itemContainerId,
      itemTemplateId,
      ownerHeroId: heroId,
      marketPrice: null,
      coreResourceModifier,
      coreResource,
      slot: null,
      durability: null,
      createdAt: new Date().toISOString(),
    };
    const container = itemContainerService.getContainer(itemContainerId);
    container.itemsInstance.push(newItem);
    return newItem;
  },

  consume() {},

  move() {},
};

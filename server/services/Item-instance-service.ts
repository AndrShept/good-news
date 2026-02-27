import { resourceTemplateById } from '@/shared/templates/resource-template';
import type { CoreResourceType, ItemInstance, ItemLocationType, OmitModifier, WeaponType, itemsInstanceDeltaEvent } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { itemDurabilityConfig } from '../lib/config/item-dutability-config';
import { materialModifierConfig } from '../lib/config/material-modifier-config';
import { generateRandomUuid, getDisplayName, getModifierByResourceKey } from '../lib/utils';
import { deltaEventsService } from './delta-events-service';
import { equipmentService } from './equipment-service';
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
  isAddPendingEvents: boolean;
}

export const itemInstanceService = {
  getItemInstance(containerId: string, itemInstanceId: string) {
    const container = itemContainerService.getContainer(containerId);
    const findItemInstance = container.itemsInstance.find((i) => i.id === itemInstanceId);
    if (!findItemInstance) throw new HTTPException(404, { message: 'getItemInstance findItemInstance  not found' });

    return findItemInstance;
  },

  createItem({ heroId, itemContainerId, itemTemplateId, quantity, location, coreResourceId, isAddPendingEvents }: ICreateItem) {
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
    const durability = this.getDurability(itemTemplateId);
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
      durability: durability ? { current: durability, max: durability } : null,
      createdAt: new Date().toISOString(),
    };
    if (isAddPendingEvents) {
      serverState.itemInstancePendingDeltaEvents.add({
        type: 'CREATE',
        item: newItem,
      });
    }
    const container = itemContainerService.getContainer(itemContainerId);
    container.itemsInstance.push(newItem);
    return newItem;
  },
  getDurability(itemTemplateId: string) {
    const template = itemTemplateService.getAllItemsTemplateMapIds()[itemTemplateId];
    if (!template.equipInfo) return;
    switch (template.type) {
      case 'WEAPON':
      case 'TOOL': {
        if (!template.equipInfo?.weaponHand || !template.equipInfo.weaponType) return;

        return itemDurabilityConfig['WEAPON'][template.equipInfo.weaponHand][template.equipInfo.weaponType];
      }
      case 'ARMOR': {
        if (!template.equipInfo?.armorCategory || !template.equipInfo.armorType) return;
        return itemDurabilityConfig['ARMOR'][template.equipInfo.armorCategory][template.equipInfo.armorType];
      }
      case 'SHIELD':
        return itemDurabilityConfig['SHIELD'];
    }
  },

  decrementDurability(heroId: string, itemInstanceId: string, value: number) {
    const hero = heroService.getHero(heroId);
    const itemInstance = equipmentService.findEquipItemByInstanceId(heroId, itemInstanceId);
    const itemTemplate = itemTemplateService.getAllItemsTemplateMapIds()[itemInstance.itemTemplateId];

    let result: itemsInstanceDeltaEvent | undefined = undefined;
    if (itemInstance.durability) {
      itemInstance.durability.current -= value;
      result = {
        type: 'UPDATE',
        itemInstanceId: itemInstance.id,
        updateData: { durability: { current: itemInstance.durability.current, max: itemInstance.durability.max } },
      };
      deltaEventsService.itemInstance.update(itemInstance.id, {
        durability: { current: itemInstance.durability.current, max: itemInstance.durability.max },
      });
      if (itemInstance.durability.current <= 0) {
        equipmentService.removeEquipment(heroId, itemInstance.id);
        result = { type: 'DELETE', itemInstanceId: itemInstance.id, itemName: itemInstance.displayName ?? itemTemplate.name };
        deltaEventsService.itemInstance.delete(itemInstance.id);
      }
    }
    return result;
  },
};

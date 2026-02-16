import { resourceTemplateById } from '@/shared/templates/resource-template';
import type { CoreResourceType, ItemInstance, ItemLocationType, OmitModifier, WeaponType } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { EquipInfo } from '../../frontend/src/features/item-instance/components/EquipInfo';
import { materialConfig } from '../../frontend/src/lib/config';
import { itemDurabilityConfig } from '../lib/config/item-dutability-config';
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

      default:
        return;
    }
  },
};

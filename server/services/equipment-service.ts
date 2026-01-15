import type { EquipmentSlotType } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { itemInstanceService } from './item-instance-service';
import { itemTemplateService } from './item-template-service';

export const equipmentService = {
  findEquipItemBySlot(slot: EquipmentSlotType, heroId: string) {
    const hero = heroService.getHero(heroId);
    const equipItem = hero.equipments.find((e) => e.slot === slot);

    return equipItem;
  },
  findEquipItemByInstanceId(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const equipedItemInstance = hero.equipments.find((e) => e.id === itemInstanceId);
    if (!equipedItemInstance) throw new HTTPException(404, { message: 'equipedItemInstance not found' });
    return equipedItemInstance;
  },
  equipItem(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const backpack = itemContainerService.getBackpack(hero.id);
    const itemInstance = itemInstanceService.getItemInstance(backpack.id, itemInstanceId);

    const slot = this.getEquipSlot(heroId, itemInstanceId);
    if (slot) {
      const equipItem = this.findEquipItemBySlot(slot, hero.id);
      if (equipItem) {
        this.unEquipItem(heroId, equipItem.id);
      }
      itemInstance.itemContainerId = null;
      itemInstance.location = 'EQUIPMENT';
      itemInstance.slot = slot;
      hero.equipments.push(itemInstance);
      itemContainerService.removeItem(backpack.id, itemInstanceId);
      heroService.updateModifier(hero.id);
    }
  },
  unEquipItem(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const backpack = itemContainerService.getBackpack(hero.id);
    const equipedItem = this.findEquipItemByInstanceId(heroId, itemInstanceId);
    heroService.checkFreeBackpackCapacity(heroId);
    const findIndex = hero.equipments.findIndex((e) => e.id === itemInstanceId);
    if (findIndex === -1) throw new HTTPException(404, { message: 'unEquipItem findIndex not found' });

    equipedItem.itemContainerId = backpack.id;
    equipedItem.location = 'BACKPACK';
    equipedItem.slot = null;
    const [itemInstance] = hero.equipments.splice(findIndex, 1);
    itemContainerService.addItem(backpack.id, itemInstance);
    heroService.updateModifier(hero.id);
  },

  getEquipSlot(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const backpack = itemContainerService.getBackpack(hero.id);
    const findItemInstance = itemInstanceService.getItemInstance(backpack.id, itemInstanceId);
    const itemTemplateById = itemTemplateService.getAllItemsTemplateMapIds();
    const itemTemplate = itemTemplateById[findItemInstance.itemTemplateId];

    switch (itemTemplate.type) {
      case 'ARMOR':
        return itemTemplate.equipInfo?.armorType;
      case 'SHIELD':
        return 'LEFT_HAND';
      case 'WEAPON': {
        const isTwoHanded = itemTemplate.equipInfo?.weaponHand === 'TWO_HANDED';
        const isOneHanded = itemTemplate.equipInfo?.weaponHand === 'ONE_HANDED';
        const existLeftSlot = this.findEquipItemBySlot('LEFT_HAND', heroId);
        if (isTwoHanded && existLeftSlot) {
          this.unEquipItem(hero.id, itemInstanceId);
          return 'RIGHT_HAND';
        }
        if (isOneHanded && !existLeftSlot) {
          return 'LEFT_HAND';
        }
        return 'RIGHT_HAND';
      }
    }
  },
};

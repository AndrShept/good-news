import { type GatheringCategorySkillKey, skillTemplateByKey } from '@/shared/templates/skill-template';
import { toolsTemplate } from '@/shared/templates/tool-template';
import type { EquipmentSlotType, itemsInstanceDeltaEvent } from '@/shared/types';
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
  findEquipTool(heroId: string, gatherSkill: GatheringCategorySkillKey) {
    if (gatherSkill === 'FORAGING') return;
    const hero = heroService.getHero(heroId);
    const skillTemplate = skillTemplateByKey[gatherSkill];
    const tool = toolsTemplate.find((t) => t.toolInfo.skillTemplateId === skillTemplate.id);
    if (!tool) throw new HTTPException(400, { message: 'tool not found' });
    const equippedTool = hero.equipments.find((e) => e.itemTemplateId === tool.id);

    return { toolInstance: equippedTool, skillTemplate, toolTemplate: tool };
  },
  findEquipItemByInstanceId(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const equippedItemInstance = hero.equipments.find((e) => e.id === itemInstanceId);
    if (!equippedItemInstance) throw new HTTPException(404, { message: 'equippedItemInstance not found' });
    return equippedItemInstance;
  },
  equipItem(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const backpack = itemContainerService.getBackpack(hero.id);
    const itemInstance = itemInstanceService.getItemInstance(backpack.id, itemInstanceId);
    const template = itemTemplateService.getAllItemsTemplateMapIds()[itemInstance.itemTemplateId];
    let resultDeltas: itemsInstanceDeltaEvent[] = [];

    const slot = this.getEquipSlot(heroId, itemInstanceId);
    if (slot) {
      const equipItem = this.findEquipItemBySlot(slot, hero.id);
      if (equipItem) {
        resultDeltas = this.unEquipItem(heroId, equipItem.id);
      }
      itemInstance.itemContainerId = null;
      itemInstance.location = 'EQUIPMENT';
      itemInstance.slot = slot;
      hero.equipments.push(itemInstance);
      itemContainerService.deleteItem(backpack.id, itemInstanceId);
      heroService.updateModifier(hero.id);

 

      
    }
  },
  unEquipItem(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const backpack = itemContainerService.getBackpack(hero.id);
    const equippedItem = this.findEquipItemByInstanceId(heroId, itemInstanceId);
    const template = itemTemplateService.getAllItemsTemplateMapIds()[equippedItem.itemTemplateId];
    const resultDeltas: itemsInstanceDeltaEvent[] = [];
    heroService.checkFreeBackpackCapacity(heroId);
    const findIndex = hero.equipments.findIndex((e) => e.id === itemInstanceId);
    if (findIndex === -1) throw new HTTPException(404, { message: 'unEquipItem findIndex not found' });

    equippedItem.itemContainerId = backpack.id;
    equippedItem.location = 'BACKPACK';
    equippedItem.slot = null;

    const [itemInstance] = hero.equipments.splice(findIndex, 1);
    const container = itemContainerService.getContainer(backpack.id);
    container.itemsInstance.push(itemInstance);
    heroService.updateModifier(hero.id);

    resultDeltas.push({ type: 'DELETE', itemInstanceId, itemName: itemInstance.displayName ?? template.name });
    resultDeltas.push({ type: 'CREATE', itemContainerId: backpack.id, item: itemInstance });
    return resultDeltas;
  },
  removeEquipment(heroId: string, itemInstanceId: string) {
    const hero = heroService.getHero(heroId);
    const index = hero.equipments.findIndex((e) => e.id === itemInstanceId);
    if (index === -1) return;
    hero.equipments.splice(index, 1);
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
      case 'SHIELD': {
        const existRightSlot = this.findEquipItemBySlot('RIGHT_HAND', heroId);
        if (existRightSlot && itemTemplateById[existRightSlot.itemTemplateId].equipInfo?.weaponHand === 'TWO_HANDED') {
          this.unEquipItem(hero.id, existRightSlot.id);
        }

        return 'LEFT_HAND';
      }

      case 'TOOL':
      case 'WEAPON': {
        const weaponHand = itemTemplate.equipInfo?.weaponHand;

        const leftItem = this.findEquipItemBySlot('LEFT_HAND', heroId);
        const rightItem = this.findEquipItemBySlot('RIGHT_HAND', heroId);

        const rightIsTwoHanded = rightItem && itemTemplateById[rightItem.itemTemplateId].equipInfo?.weaponHand === 'TWO_HANDED';

        // TWO HANDED
        if (weaponHand === 'TWO_HANDED') {
          if (leftItem) this.unEquipItem(hero.id, leftItem.id);
          if (rightItem) this.unEquipItem(hero.id, rightItem.id);
          return 'RIGHT_HAND';
        }

        // ONE HANDED
        if (weaponHand === 'ONE_HANDED') {
          if (rightIsTwoHanded) {
            this.unEquipItem(hero.id, rightItem.id);
            return 'RIGHT_HAND';
          }

          if (!rightItem) return 'RIGHT_HAND';
          if (!leftItem) return 'LEFT_HAND';

          return 'RIGHT_HAND';
        }

        break;
      }
      default:
        throw new HTTPException(400, { message: 'Invalid item type for equipping' });
    }
  },
};

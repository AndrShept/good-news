import { type GatheringCategorySkillKey, skillTemplateByKey } from '@/shared/templates/skill-template';
import { toolsTemplate } from '@/shared/templates/tool-template';
import type { EquipmentSlotType, ItemInstance, ItemTemplate, itemsInstanceDeltaEvent } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { itemInstanceService } from './item-instance-service';
import { itemTemplateService } from './item-template-service';

export const equipmentService = {
  getEquipSlotData(heroId: string, itemTemplate: ItemTemplate) {
    const hero = heroService.getHero(heroId);
    const rightHand = hero.equipments.find((e) => e.slot === 'RIGHT_HAND');
    const leftHand = hero.equipments.find((e) => e.slot === 'LEFT_HAND');
    const template = itemTemplateService.getAllItemsTemplateMapIds();
    switch (itemTemplate.type) {
      case 'TOOL':
      case 'WEAPON': {
        switch (itemTemplate.equipInfo?.weaponHand) {
          case 'TWO_HANDED':
            return {
              equippedItems: hero.equipments.filter((e) => e.slot === 'RIGHT_HAND' || e.slot === 'LEFT_HAND'),
              slot: 'RIGHT_HAND',
            };
          case 'ONE_HANDED': {
            if (!rightHand && !leftHand) return { slot: 'RIGHT_HAND', equippedItems: [] };
            if (rightHand && leftHand) return { slot: 'RIGHT_HAND', equippedItems: [rightHand] };
            if (!rightHand && leftHand) return { slot: 'RIGHT_HAND', equippedItems: [] };
            if (rightHand && template[rightHand.itemTemplateId].equipInfo?.weaponHand === 'TWO_HANDED' && !leftHand) {
              return { slot: 'RIGHT_HAND', equippedItems: [rightHand] };
            } else {
              return { slot: 'LEFT_HAND', equippedItems: [] };
            }
          }
        }
        break;
      }
      case 'SHIELD': {
        if (!leftHand && rightHand && template[rightHand.itemTemplateId].equipInfo?.weaponHand !== 'TWO_HANDED')
          return { slot: 'LEFT_HAND', equippedItems: [] };
        if (rightHand && template[rightHand.itemTemplateId].equipInfo?.weaponHand === 'TWO_HANDED') {
          return { slot: 'LEFT_HAND', equippedItems: [rightHand] };
        }
        if (leftHand) return { slot: 'LEFT_HAND', equippedItems: [leftHand] };
        break;
      }

      case 'ARMOR':
        return {
          equippedItems: hero.equipments.filter((e) => e.slot === itemTemplate.equipInfo?.armorType),
          slot: itemTemplate.equipInfo?.armorType as EquipmentSlotType,
        };
      default:
        throw new HTTPException(400, { message: 'Invalid item type for equipping' });
    }
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

    const equipData = this.getEquipSlotData(hero.id, template);
    if (!equipData || !equipData.slot) return [];
    for (const equippedItem of equipData.equippedItems) {
      const unEquipItem = this.unEquipItem(heroId, equippedItem.id);
      resultDeltas.push(...unEquipItem);
    }

    itemInstance.itemContainerId = null;
    itemInstance.location = 'EQUIPMENT';
    itemInstance.slot = equipData.slot as EquipmentSlotType;
    hero.equipments.push(itemInstance);
    itemContainerService.deleteItem(backpack.id, itemInstanceId);
    heroService.updateModifier(hero.id);
    resultDeltas.push({
      type: 'DELETE',
      itemContainerId: backpack.id,
      itemInstanceId,
      itemName: itemInstance.displayName ?? template.name,
    });
    resultDeltas.push({ type: 'CREATE', item: itemInstance });

    return resultDeltas;
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
  // getEquipSlot(itemTemplate: ItemTemplate) {
  //   switch (itemTemplate.type) {
  //     case 'ARMOR':
  //       return itemTemplate.equipInfo?.armorType;
  //     case 'SHIELD':
  //       return 'LEFT_HAND';

  //     case 'TOOL':
  //     case 'WEAPON':
  //       return 'RIGHT_HAND';

  //     default:
  //       throw new HTTPException(400, { message: 'Invalid item type for equipping' });
  //   }
  // },
};

import type { EquipmentSlotType } from '@/shared/types';

import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';

export const equipmentService = {
  async equipItem() {},

  async unEquipItem() {},

  findEquipItem(slot: EquipmentSlotType, heroId: string) {
    const hero = heroService.getHero(heroId);
    const equipItem = hero.equipments.find((e) => e.slot === slot);

    return equipItem;
  },

  async getEquipSlot() {
    if (itemInstance.itemTemplate?.type === 'ARMOR') {
      return itemInstance.itemTemplate.equipInfo?.armorType === 'SHIELD' ? 'LEFT_HAND' : itemInstance.itemTemplate.equipInfo?.armorType;
    }
    if (itemInstance.itemTemplate?.type === 'SHIELD') {
      return 'LEFT_HAND';
    }
    if (itemInstance.itemTemplate?.type === 'WEAPON') {
      const isTwoHanded = itemInstance.itemTemplate?.equipInfo?.weaponHand === 'TWO_HANDED';
      const isOneHanded = itemInstance.itemTemplate?.equipInfo?.weaponHand === 'ONE_HANDED';
      const existLeftSlot = this.findEquipItem('LEFT_HAND', heroId);
      if (isTwoHanded && existLeftSlot) {
        await this.unEquipItem({
          equipmentItemId: existLeftSlot.id,
          gameItemId: existLeftSlot.gameItemId,
          heroId,
          itemContainerId,
          maxSlots,
          usedSlots,
        });

        return 'RIGHT_HAND';
      }
      if (isOneHanded && !existLeftSlot) {
        return 'LEFT_HAND';
      }
      return 'RIGHT_HAND';
    }
  },
};

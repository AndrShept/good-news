import type { EquipmentSlotType, ItemInstance } from '@/shared/types';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction, db } from '../db/db';
import { heroTable } from '../db/schema';
import { serverState } from '../game/state/hero-state';
import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';

interface IEquipItem {
  inventoryItemId: string;
  gameItemId: string;
  heroId: string;
  itemContainerId: string;
  slot: EquipmentSlotType;
}

interface IUnEquipItem {
  equipmentItemId: string;
  itemInstance: string;
  itemContainerId: string;
  heroId: string;
  usedSlots: number;
  maxSlots: number;
}

interface IGetEquip {
  itemInstance: ItemInstance;
  itemContainerId: string;
  heroId: string;
  usedSlots: number;
  maxSlots: number;
}

export const equipmentService = (db: TTransaction | TDataBase) => ({


  async equipItem({ gameItemId, inventoryItemId, heroId, slot, itemContainerId }: IEquipItem) {
    // await db.insert(equipmentTable).values({
    //   heroId,
    //   gameItemId,
    //   slot,
    // });
    // await db.delete(containerSlotTable).where(eq(containerSlotTable.id, inventoryItemId));
    // await itemContainerService(db).setUsedSlots(itemContainerId);
    // await heroService(db).updateModifier(heroId);
  },

  async unEquipItem({ equipmentItemId, itemInstance, heroId, itemContainerId, maxSlots, usedSlots }: IUnEquipItem) {
    // const isInventoryFull = usedSlots >= maxSlots;

    // if (isInventoryFull) {
    //   throw new HTTPException(409, { message: 'Inventory is full', cause: { canShow: true } });
    // }

    // await db.delete(equipmentTable).where(eq(equipmentTable.id, equipmentItemId));
    // const [newInventoryItem] = await db.insert(containerSlotTable).values({ gameItemId, itemContainerId }).returning();
    // await itemContainerService(db).setUsedSlots(itemContainerId);
    // await heroService(db).updateModifier(heroId);

    // return {
    //   success: true,
    //   data: newInventoryItem,
    // };
  },

  findEquipItem(slot: EquipmentSlotType, heroId: string) {
    const heroState = serverState.getHeroState(heroId);
    const equipItem = heroState.equipments.find((e) => e.slot === slot);

    if (!equipItem) return;

    return equipItem;
  },

  async getEquipSlot({ usedSlots, maxSlots, itemContainerId, heroId, itemInstance }: IGetEquip): Promise<EquipmentSlotType | undefined> {
    // if (itemInstance.itemTemplate?.type === 'ARMOR') {
    //   return itemInstance.itemTemplate.equipInfo?.armorType === 'SHIELD' ? 'LEFT_HAND' : itemInstance.itemTemplate.equipInfo?.armorType;
    // }
    // if (itemInstance.itemTemplate?.type === 'SHIELD') {
    //   return 'LEFT_HAND';
    // }
    // if (itemInstance.itemTemplate?.type === 'WEAPON') {
    //   const isTwoHanded = itemInstance.itemTemplate?.equipInfo?.weaponHand === 'TWO_HANDED';
    //   const isOneHanded = itemInstance.itemTemplate?.equipInfo?.weaponHand === 'ONE_HANDED';
    //   const existLeftSlot = this.findEquipItem('LEFT_HAND', heroId);
    //   if (isTwoHanded && existLeftSlot) {
    //     await this.unEquipItem({
    //       equipmentItemId: existLeftSlot.id,
    //       gameItemId: existLeftSlot.gameItemId,
    //       heroId,
    //       itemContainerId,
    //       maxSlots,
    //       usedSlots,
    //     });

    //     return 'RIGHT_HAND';
    //   }
    //   if (isOneHanded && !existLeftSlot) {
    //     return 'LEFT_HAND';
    //   }
    //   return 'RIGHT_HAND';
    // }
  },
});

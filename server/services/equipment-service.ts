import type { EquipmentSlotType, GameItem } from '@/shared/types';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction, db } from '../db/db';
import { containerSlotTable, equipmentTable, heroTable } from '../db/schema';
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
  gameItemId: string;
  itemContainerId: string;
  heroId: string;
  usedSlots: number;
  maxSlots: number;
}

interface IGetEquip {
  item: GameItem;
  itemContainerId: string;
  heroId: string;
  usedSlots: number;
  maxSlots: number;
}

export const equipmentService = (db: TTransaction | TDataBase) => ({
  async equipItem({ gameItemId, inventoryItemId, heroId, slot, itemContainerId }: IEquipItem) {
    await db.insert(equipmentTable).values({
      heroId,
      gameItemId,
      slot,
    });
    await db.delete(containerSlotTable).where(eq(containerSlotTable.id, inventoryItemId));
    await itemContainerService(db).setUsedSlots(itemContainerId);
    await heroService(db).updateModifier(heroId);
  },

  async unEquipItem({ equipmentItemId, gameItemId, heroId, itemContainerId, maxSlots, usedSlots }: IUnEquipItem) {
    const isInventoryFull = usedSlots >= maxSlots;

    if (isInventoryFull) {
      throw new HTTPException(409, { message: 'Inventory is full', cause: { canShow: true } });
    }

    await db.delete(equipmentTable).where(eq(equipmentTable.id, equipmentItemId));
    const [newInventoryItem] = await db.insert(containerSlotTable).values({ gameItemId, itemContainerId }).returning();
    await itemContainerService(db).setUsedSlots(itemContainerId);
    await heroService(db).updateModifier(heroId);

    return {
      success: true,
      data: newInventoryItem,
    };
  },

  async findEquipItem(slot: EquipmentSlotType, heroId: string) {
    const equipItem = await db.query.equipmentTable.findFirst({
      where: and(eq(equipmentTable.heroId, heroId), eq(equipmentTable.slot, slot)),
    });
    if (!equipItem) return;

    return equipItem;
  },

  async getEquipSlot({ usedSlots, maxSlots, itemContainerId, heroId, item }: IGetEquip): Promise<EquipmentSlotType | undefined> {
    if (item.type === 'ARMOR') {
      return item.armor?.slot === 'SHIELD' ? 'LEFT_HAND' : item.armor?.slot;
    }
    if (item.type === 'WEAPON') {
      const isTwoHanded = item.weapon?.weaponHand === 'TWO_HANDED';
      const isOneHanded = item.weapon?.weaponHand === 'ONE_HANDED';
      const existLeftSlot = await this.findEquipItem('LEFT_HAND', heroId);
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
});

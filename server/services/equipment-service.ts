// services/equipment.service.ts
import type { EquipmentSlotType, GameItem } from '@/shared/types';
import { and, eq } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction, db } from '../db/db';
import { equipmentTable, heroTable, inventoryItemTable } from '../db/schema';
import { heroService } from './hero-service';

interface IEquipItem {
  inventoryItemId: string;
  gameItemId: string;
  heroId: string;
  slot: EquipmentSlotType;
  db: TTransaction | TDataBase;
}

interface IUnEquipItem {
  equipmentItemId: string;
  gameItemId: string;
  heroId: string;
  db: TTransaction | TDataBase;
  currentInventorySlots: number;
  maxInventorySlot: number;
}

interface IGetEquip {
  db: TTransaction | TDataBase;
  item: GameItem;
  heroId: string;
  currentInventorySlots: number;
  maxInventorySlot: number;
}

export const equipmentService = {
  async equipItem({ db, gameItemId, inventoryItemId, heroId, slot }: IEquipItem) {
    await db.insert(equipmentTable).values({
      heroId,
      gameItemId,
      slot,
    });
    await db.delete(inventoryItemTable).where(eq(inventoryItemTable.id, inventoryItemId));
    await heroService.decrementCurrentInventorySlots(db, heroId);
  },

  async unEquipItem({ db, equipmentItemId, gameItemId, heroId, currentInventorySlots, maxInventorySlot }: IUnEquipItem) {
    const isInventoryFull = currentInventorySlots >= maxInventorySlot;

    if (isInventoryFull) {
      return isInventoryFull;
    }

    await db.delete(equipmentTable).where(eq(equipmentTable.id, equipmentItemId));
    await db.insert(inventoryItemTable).values({ gameItemId, heroId });
    await heroService.incrementCurrentInventorySlo(db, heroId);
  },

  async findEquipItem(db: TTransaction | TDataBase, slot: EquipmentSlotType, heroId: string) {
    const equipItem = await db.query.equipmentTable.findFirst({
      where: and(eq(equipmentTable.heroId, heroId), eq(equipmentTable.slot, slot)),
    });
    if (!equipItem) return;

    return equipItem;
  },

  async getEquipSlot({ currentInventorySlots, maxInventorySlot, db, heroId, item }: IGetEquip): Promise<EquipmentSlotType | undefined> {
    if (item.type === 'ARMOR') {
      return item.armor?.slot === 'SHIELD' ? 'LEFT_HAND' : item.armor?.slot;
    }
    if (item.type === 'WEAPON') {
      const isTwoHanded = item.weapon?.weaponHand === 'TWO_HANDED';
      const isOneHanded = item.weapon?.weaponHand === 'ONE_HANDED';
      const existLeftSlot = await this.findEquipItem(db, 'LEFT_HAND', heroId);
      if (isTwoHanded && existLeftSlot) {
       const isInventoryFull =  await this.unEquipItem({
          equipmentItemId: existLeftSlot.id,
          gameItemId: existLeftSlot.gameItemId,
          heroId,
          db,
          currentInventorySlots,
          maxInventorySlot,
        });
        if(isInventoryFull) return 
        return 'RIGHT_HAND';
      }
      if (isOneHanded && !existLeftSlot) {
        return 'LEFT_HAND';
      }
      return 'RIGHT_HAND';
    }
  },
};

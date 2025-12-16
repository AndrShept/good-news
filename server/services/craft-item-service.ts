import { materialModifierConfig } from '@/shared/config/material-modifier-config';
import type {
  ArmorType,
  CraftItem,
  CraftItemRequiredResources,
  GameItem,
  GameItemType,
  IngotType,
  LeatherType,
  ResourceType,
} from '@/shared/types';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { craftConfig } from '../../shared/config/craft-config';
import type { TDataBase, TTransaction } from '../db/db';
import { containerSlotTable, craftItemTable, resourceTable } from '../db/schema';
import { itemContainerService } from './item-container-service';

export const craftItemService = (db: TTransaction | TDataBase) => ({
  async getCraftItem(craftItemId: string, options?: Parameters<typeof db.query.craftItemTable.findFirst>[0]): Promise<CraftItem> {
    const craftItem = await db.query.craftItemTable.findFirst({
      where: eq(craftItemTable.id, craftItemId),
      ...options,
    });
    if (!craftItem) {
      throw new HTTPException(404, {
        message: 'craft item not found',
      });
    }
    return craftItem;
  },

  getCraftItemRequirement(gameItem: GameItem , coreMaterialType: ResourceType | undefined | null) {
   
    const { type, name, armor, weapon } = gameItem;

    if (type === 'WEAPON') {
      if (!coreMaterialType) return;
      if (!weapon) {
        console.error('getCraftItemRequirement gameItem.weapon not found ');
        return;
      }

      return craftConfig[type][weapon.weaponType][coreMaterialType as IngotType];
    }
    if (type === 'ARMOR') {
      if (!coreMaterialType) return;
      if (!armor) {
        console.error('getCraftItemRequirement gameItem.armor not found ');
        return;
      }

      return craftConfig[type][armor.type][coreMaterialType as LeatherType | IngotType];
    }
    return craftConfig[type][name];
  },
  getMaterialModifier(gameItem: GameItem , coreMaterialType: IngotType | LeatherType | undefined) {
    
    if (!coreMaterialType) {
      console.error('getMaterialModifier coreMaterialType not found ');
      return;
    }

    const { type, armor, weapon } = gameItem;

    if (type === 'WEAPON') {
      if (!weapon) {
        console.error('getMaterialModifier gameItem.weapon not found ');
        return;
      }

      return materialModifierConfig[type][coreMaterialType as IngotType];
    }
    if (type === 'ARMOR') {
      if (!armor) {
        console.error('getMaterialModifier gameItem.armor not found ');
        return;
      }
      const armorType = armor.type;
      if (armorType === 'PLATE' || armorType === 'MAIL') {
        return materialModifierConfig.ARMOR[armorType][coreMaterialType as IngotType];
      }

      if (armorType === 'LEATHER' || armorType === 'CLOTH') {
        return materialModifierConfig.ARMOR[armorType][coreMaterialType as LeatherType];
      }
    }
    if (type === 'SHIELD') {
      return materialModifierConfig[type][coreMaterialType as IngotType];
    }
  },
});

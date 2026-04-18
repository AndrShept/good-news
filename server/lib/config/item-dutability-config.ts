import type { ArmorType, ClothType, IngotType, LeatherType, ResourceType, WeaponHandType, WeaponType } from '@/shared/types';

export interface ItemDurabilityConfig {
  WEAPON: Record<WeaponType, number>;
  SHIELD: number;
  ARMOR: {
    PLATE: Record<ArmorType, number>;
    MAIL: Record<ArmorType, number>;
    LEATHER: Record<ArmorType, number>;
    CLOTH: Record<ArmorType, number>;
  };
  TOOL: Record<WeaponType, number>;
}

export const itemDurabilityConfig: ItemDurabilityConfig = {
  WEAPON: {
    AXE: 60,
    DAGGER: 40,
    MACE: 70,
    STAFF: 50,
    SWORD: 55,
  },
  SHIELD: 70,
  ARMOR: {
    PLATE: {
      BELT: 30,
      BOOTS: 35,
      CHEST: 60,
      GLOVES: 30,
      HELMET: 40,
      LEGS: 50,
      SHIELD: 70,
    },
    MAIL: {
      BELT: 30,
      BOOTS: 35,
      CHEST: 60,
      GLOVES: 30,
      HELMET: 40,
      LEGS: 50,
      SHIELD: 70,
    },
    LEATHER: {
      BELT: 30,
      BOOTS: 35,
      CHEST: 60,
      GLOVES: 30,
      HELMET: 40,
      LEGS: 50,
      SHIELD: 70,
    },
    CLOTH: {
      BELT: 30,
      BOOTS: 35,
      CHEST: 60,
      GLOVES: 30,
      HELMET: 40,
      LEGS: 50,
      SHIELD: 70,
    },
  },
  TOOL: {
    AXE: 60,
    DAGGER: 40,
    MACE: 70,
    STAFF: 50,
    SWORD: 55,
  },
};

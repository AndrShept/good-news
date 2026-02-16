import type { ArmorType, ClothType, IngotType, LeatherType, OmitModifier, ResourceType, WeaponHandType, WeaponType } from '@/shared/types';

export interface ItemDurabilityConfig {
  WEAPON: Record<WeaponHandType, Record<WeaponType, number>>;
  SHIELD: number;
  ARMOR: {
    PLATE: Record<ArmorType, number>;
    MAIL: Record<ArmorType, number>;
    LEATHER: Record<ArmorType, number>;
    CLOTH: Record<ArmorType, number>;
  };
  TOOL: Record<WeaponHandType, Record<WeaponType, number>>;
}

export const itemDurabilityConfig: ItemDurabilityConfig = {
  WEAPON: {
    ONE_HANDED: {
      AXE: 60,
      DAGGER: 40,
      MACE: 70,
      STAFF: 120,
      SWORD: 55,
    },
    TWO_HANDED: {
      AXE: 100,
      DAGGER: 70,
      MACE: 130,
      STAFF: 120,
      SWORD: 100,
    },
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
    ONE_HANDED: {
      AXE: 60,
      DAGGER: 40,
      MACE: 70,
      STAFF: 120,
      SWORD: 55,
    },
    TWO_HANDED: {
      AXE: 100,
      DAGGER: 70,
      MACE: 130,
      STAFF: 120,
      SWORD: 100,
    },
  },
};

import type { ArmorType, ClothType, IngotType, LeatherType, OmitModifier, ResourceType, WeaponType } from '@/shared/types';

export interface IMaterialModifierConfig {
  WEAPON: Record<IngotType, Partial<OmitModifier>>;
  SHIELD: Record<IngotType, Partial<OmitModifier>>;
  ARMOR: {
    PLATE: Record<IngotType, Partial<OmitModifier>>;
    MAIL: Record<IngotType, Partial<OmitModifier>>;
    LEATHER: Record<LeatherType, Partial<OmitModifier>>;
    CLOTH: Record<ClothType, Partial<OmitModifier>>;
  };
}

export const materialModifierConfig: IMaterialModifierConfig = {
  WEAPON: {
    'IRON_INGOT': {},
    'COPPER_INGOT': { physDamage: 5 },
    'SILVER_INGOT': { physHitChance: 10 },
    'GOLD_INGOT': { physCritPower: 10 },
    'MITHRIL_INGOT': { physDamage: 10, physCritChance: 10, physHitChance: 10 },
    'ADAMANTINE_INGOT': { physDamage: 15, physCritChance: 10, physHitChance: 7, physCritPower: 10 },
  },
  SHIELD: {
    'IRON_INGOT': {},
    'COPPER_INGOT': { defense: 10 },
    'SILVER_INGOT': { defense: 20 },
    'GOLD_INGOT': { defense: 20, magicResistance: 10 },
    'MITHRIL_INGOT': { defense: 30, magicResistance: 20 },
    'ADAMANTINE_INGOT': { defense: 50, maxHealth: 50, magicResistance: 20 },
  },
  ARMOR: {
    PLATE: {
      'IRON_INGOT': {},
      'COPPER_INGOT': { defense: 10 },
      'SILVER_INGOT': { evasion: 10 },
      'GOLD_INGOT': { magicResistance: 10 },
      'MITHRIL_INGOT': { defense: 20, magicResistance: 10 },
      'ADAMANTINE_INGOT': { defense: 30, maxHealth: 20, evasion: 10, magicResistance: 10 },
    },
    MAIL: {
      'IRON_INGOT': {},
      'COPPER_INGOT': { defense: 10 },
      'SILVER_INGOT': { evasion: 10 },
      'GOLD_INGOT': { magicResistance: 10 },
      'MITHRIL_INGOT': { defense: 20, magicResistance: 10 },
      'ADAMANTINE_INGOT': { defense: 30, maxHealth: 20, evasion: 10, magicResistance: 10 },
    },
    LEATHER: {
      'REGULAR_LEATHER': {},
    },
    CLOTH: {
      'REGULAR_CLOTH': {},
    },
  },
};

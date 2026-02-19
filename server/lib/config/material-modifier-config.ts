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
    'COPPER_INGOT': { physDamage: 10 },
    'SILVER_INGOT': { physHitRating: 50 },
    'GOLD_INGOT': { physCritDamage: 60 },
    'MITHRIL_INGOT': { physDamage: 20, physHitRating: 40, physCritRating: 40 },
    'ADAMANTINE_INGOT': { physDamage: 30, physHitRating: 50, physCritRating: 55, physCritDamage: 50 },
  },
  SHIELD: {
    'IRON_INGOT': {},
    'COPPER_INGOT': { armor: 10 },
    'SILVER_INGOT': { armor: 20 },
    'GOLD_INGOT': { armor: 20, magicResistance: 10 },
    'MITHRIL_INGOT': { armor: 30, magicResistance: 20 },
    'ADAMANTINE_INGOT': { armor: 50, maxHealth: 50, magicResistance: 20 },
  },
  ARMOR: {
    PLATE: {
      'IRON_INGOT': {},
      'COPPER_INGOT': { armor: 10 },
      'SILVER_INGOT': { evasion: 10 },
      'GOLD_INGOT': { magicResistance: 10 },
      'MITHRIL_INGOT': { armor: 20, magicResistance: 10 },
      'ADAMANTINE_INGOT': { armor: 30, maxHealth: 20, evasion: 10, magicResistance: 10 },
    },
    MAIL: {
      'IRON_INGOT': {},
      'COPPER_INGOT': { armor: 10 },
      'SILVER_INGOT': { evasion: 10 },
      'GOLD_INGOT': { magicResistance: 10 },
      'MITHRIL_INGOT': { armor: 20, magicResistance: 10 },
      'ADAMANTINE_INGOT': { armor: 30, maxHealth: 20, evasion: 10, magicResistance: 10 },
    },
    LEATHER: {
      'REGULAR_LEATHER': {},
    },
    CLOTH: {
      'REGULAR_CLOTH': {},
    },
  },
};

import type { ArmorType, IngotType, LeatherType, OmitModifier, ResourceType, WeaponType } from '@/shared/types';

export interface IMaterialModifierConfig {
  WEAPON: Record<IngotType, Partial<OmitModifier>>;
  SHIELD: Record<IngotType, Partial<OmitModifier>>;
  ARMOR: {
    PLATE: Record<IngotType, Partial<OmitModifier>>;
    MAIL: Record<IngotType, Partial<OmitModifier>>;
    LEATHER: Record<LeatherType, Partial<OmitModifier>>;
    CLOTH: Record<LeatherType, Partial<OmitModifier>>;
  };
}

export const materialModifierConfig: IMaterialModifierConfig = {
  WEAPON: {
    'IRON-INGOT': {},
    'COPPER-INGOT': { defense: 10 },
    'SILVER-INGOT': { evasion: 10 },
    'GOLD-INGOT': { magicResistance: 10 },
    'MITHRIL-INGOT': { defense: 20, magicResistance: 10 },
    'ADAMANTINE-INGOT': { defense: 30, maxHealth: 20, evasion: 10, magicResistance: 10 },
  },
  SHIELD: {
    'IRON-INGOT': {},
    'COPPER-INGOT': { defense: 10 },
    'SILVER-INGOT': { defense: 20 },
    'GOLD-INGOT': { defense: 20, magicResistance: 10 },
    'MITHRIL-INGOT': { defense: 30, magicResistance: 20 },
    'ADAMANTINE-INGOT': { defense: 50, maxHealth: 50, magicResistance: 20 },
  },
  ARMOR: {
    PLATE: {
      'IRON-INGOT': {},
      'COPPER-INGOT': { defense: 10 },
      'SILVER-INGOT': { evasion: 10 },
      'GOLD-INGOT': { magicResistance: 10 },
      'MITHRIL-INGOT': { defense: 20, magicResistance: 10 },
      'ADAMANTINE-INGOT': { defense: 30, maxHealth: 20, evasion: 10, magicResistance: 10 },
    },
    MAIL: {
      'IRON-INGOT': {},
      'COPPER-INGOT': { defense: 10 },
      'SILVER-INGOT': { evasion: 10 },
      'GOLD-INGOT': { magicResistance: 10 },
      'MITHRIL-INGOT': { defense: 20, magicResistance: 10 },
      'ADAMANTINE-INGOT': { defense: 30, maxHealth: 20, evasion: 10, magicResistance: 10 },
    },
    LEATHER: {
      'REGULAR-LEATHER': {},
    },
    CLOTH: {
      'REGULAR-LEATHER': {},
    },
  },
};

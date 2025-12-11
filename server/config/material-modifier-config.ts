import type { ArmorType, IngotType, LeatherType, OmitModifier, ResourceType, WeaponType } from '@/shared/types';

export interface IMaterialModifierConfig {
  WEAPON: Record<WeaponType, Record<IngotType, Partial<OmitModifier>>>;
  ARMOR: Record<ArmorType, Record<IngotType | LeatherType, Partial<OmitModifier>>>;
}

export const materialModifierConfig: IMaterialModifierConfig = {
  WEAPON: {
    DAGGER: {
      'IRON-INGOT': {},
      'SILVER-INGOT': {},
      'GOLD-INGOT': undefined,
      'MITHRIL-INGOT': undefined,
      'ADAMANTINE-INGOT': undefined,
    },
    SWORD: undefined,
    AXE: undefined,
    STAFF: undefined,
  },
};

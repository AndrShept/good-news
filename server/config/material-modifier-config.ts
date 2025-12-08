import type { OmitModifier, ResourceType } from '@/shared/types';

export const materialModifierConfig: Partial<Record<ResourceType, Partial<OmitModifier>>> = {
  // INGOT
  'IRON-INGOT': {},
  'COPPER-INGOT': { defense: 10 },
  'SILVER-INGOT': { magicResistance: 10 },
  'GOLD-INGOT': { dexterity: 10 },
  'MITHRIL-INGOT': { intelligence: 10 },
  'ADAMANTINE-INGOT': { constitution: 10 },

  //LEATHER
  'REGULAR-LEATHER': {},
};

import type { OmitModifier, ResourceType } from '@/shared/types';

export const resourceModifierEntity: Record<ResourceType, Partial<OmitModifier>> = {
  IRON: {},
  COPPER: { defense: 10 },
  ADAMANTINE: { constitution: 10 },
  GOLD: { dexterity: 10 },
  MITHRIL: { intelligence: 10 },
  SILVER: { magicResistance: 10 },
  'REGULAR-LEATHER': {},
};

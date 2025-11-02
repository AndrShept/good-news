import type { OmitModifier, ResourceType } from '@/shared/types';

export const resourceModifierEntity: Record<ResourceType, Partial<OmitModifier>> = {
  IRON: { maxHealth: 10 },
  COPPER: { defense: 10 },
  ADAMANTINE: { constitution: 1 },
  GOLD: { constitution: 1 },
  MITHRIL: { constitution: 1 },
  SILVER: { constitution: 1 },
};

import type { SkillKey } from '@/shared/templates/skill-template';
import type { RarityType } from '@/shared/types';

export const skillExpConfig = {
  SMELTING: {
    difficultyMultiplier: 1.6,
  },
  BLACKSMITHING: {
    difficultyMultiplier: 1.9,
  },
  TAILORING: {
    difficultyMultiplier: 2.0,
  },
  ALCHEMY: {
    difficultyMultiplier: 2.1,
  },
  CARPENTRY: {
    difficultyMultiplier: 2.1,
  },
  MINING: {
    difficultyMultiplier: 1.5,
  },

  FISHING: {
    difficultyMultiplier: 1.5,
  },
  LUMBERJACKING: {
    difficultyMultiplier: 1.5,
  },
  HERBALISM: {
    difficultyMultiplier: 1.5
  },
  SKINNING: {
    difficultyMultiplier: 1.5
  },

  CLOTH_LORE: {
    difficultyMultiplier: 2.2,
  },
  INGOT_LORE: {
    difficultyMultiplier: 2.2,
  },
  LEATHER_LORE: {
    difficultyMultiplier: 2.2,
  },
  WOOD_LORE: {
    difficultyMultiplier: 2.2,
  },
  HERB_LORE: {
    difficultyMultiplier: 2.2,
  },
  ORE_LORE: {
    difficultyMultiplier: 2.2,
  },
  MEDITATION: {
    difficultyMultiplier: 2.5,
  },
  REGENERATION: {
    difficultyMultiplier: 2.6,
  },
} as const satisfies Record<SkillKey, { difficultyMultiplier: number }>;


import type { SkillKey } from '@/shared/templates/skill-template';

export const skillExpConfig = {
  // Crafting
  SMELTING: { difficultyMultiplier: 0.35 },
  BLACKSMITHING: { difficultyMultiplier: 0.45 },
  TAILORING: { difficultyMultiplier: 0.5 },
  ALCHEMY: { difficultyMultiplier: 0.55 },
  CARPENTRY: { difficultyMultiplier: 0.5 },

  // Gathering
  MINING: { difficultyMultiplier: 0.3 },
  FISHING: { difficultyMultiplier: 0.3 },
  LUMBERJACKING: { difficultyMultiplier: 0.3 },
  SKINNING: { difficultyMultiplier: 0.3 },
  FORAGING: { difficultyMultiplier: 0.3 },

  CLOTH_LORE: { difficultyMultiplier: 0.6 },
  INGOT_LORE: { difficultyMultiplier: 0.6 },
  LEATHER_LORE: { difficultyMultiplier: 0.6 },
  WOOD_LORE: { difficultyMultiplier: 0.6 },
  HERB_LORE: { difficultyMultiplier: 0.6 },
  ORE_LORE: { difficultyMultiplier: 0.6 },

  // Passive
  MEDITATION: { difficultyMultiplier: 0.7 },
  REGENERATION: { difficultyMultiplier: 0.75 },
} as const satisfies Record<SkillKey, { difficultyMultiplier: number }>;

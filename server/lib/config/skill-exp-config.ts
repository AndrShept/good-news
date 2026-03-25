import type { SkillKey } from '@/shared/templates/skill-template';

export const skillExpConfig = {
  // Crafting
  BLACKSMITHING: { difficultyMultiplier: 0.45 },
  TAILORING: { difficultyMultiplier: 0.5 },
  ALCHEMY: { difficultyMultiplier: 0.55 },
  CARPENTRY: { difficultyMultiplier: 0.5 },

  // Gathering
  MINING: { difficultyMultiplier: 0.3 },
  FISHING: { difficultyMultiplier: 0.3 },
  WOODCUTTING: { difficultyMultiplier: 0.3 },
  SKINNING: { difficultyMultiplier: 0.3 },
  FORAGING: { difficultyMultiplier: 0.3 },

  //PROCESSING
  SMELTING: { difficultyMultiplier: 0.35 },
  TANNING: { difficultyMultiplier: 0.35 },
  WEAVING: { difficultyMultiplier: 0.35 },
  SAWMILLING: { difficultyMultiplier: 0.35 },

  //LORE
  WOOD_LORE: { difficultyMultiplier: 0.8 },
  HERB_LORE: { difficultyMultiplier: 0.6 },
  ORE_LORE: { difficultyMultiplier: 0.6 },
  BONE_LORE: { difficultyMultiplier: 0.6 },
  METAL_LORE: { difficultyMultiplier: 0.6 },
  HIDE_LORE: { difficultyMultiplier: 0.6 },
  FIBER_LORE: { difficultyMultiplier: 0.6 },
  CLOTH_LORE: { difficultyMultiplier: 0.6 },
  FLOWER_LORE: { difficultyMultiplier: 0.6 },
  LEATHER_LORE: { difficultyMultiplier: 0.6 },
  MUSHROOM_LORE: { difficultyMultiplier: 0.6 },
  FUR_LORE: { difficultyMultiplier: 0.6 },
  CURED_FUR_LORE: { difficultyMultiplier: 0.6 },

  // Passive
  MEDITATION: { difficultyMultiplier: 0.7 },
  REGENERATION: { difficultyMultiplier: 0.75 },
} as const satisfies Record<SkillKey, { difficultyMultiplier: number }>;

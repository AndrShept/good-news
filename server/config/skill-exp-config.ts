import type { RarityType, SkillType } from '@/shared/types';

export const skillExpConfig = {
  SMELTING: {
    difficultyMultiplier: 1.6,
  },
  BLACKSMITHING: {
    difficultyMultiplier: 1.9,
  },
  MINING: {
    difficultyMultiplier: 1.5,
  },
  ALCHEMY: {
    difficultyMultiplier: 2.1,
  },
} as const satisfies Record<SkillType, { difficultyMultiplier: number }>;

export const rarityXpRewards: Record<RarityType, number> = {
  COMMON: 10,
  MAGIC: 20,
  EPIC: 40,
  RARE: 80,
  LEGENDARY: 100,
} as const;

import type { CoreResourceType } from '@/shared/types';

export type ResourceMeta = {
  requiredMinSkill: number;
  durabilityMultiplier: number;

  weight?: number;
  rarity?: number;
};

export const resourceMetaConfig = {
  //-------- INGOT ------//
  IRON_INGOT: { requiredMinSkill: 0, durabilityMultiplier: 1.0 },
  COPPER_INGOT: { requiredMinSkill: 20, durabilityMultiplier: 0.9 },
  SILVER_INGOT: { requiredMinSkill: 30, durabilityMultiplier: 1.1 },
  GOLD_INGOT: { requiredMinSkill: 40, durabilityMultiplier: 0.8 },
  MITHRIL_INGOT: { requiredMinSkill: 60, durabilityMultiplier: 1.5 },
  ADAMANTINE_INGOT: { requiredMinSkill: 80, durabilityMultiplier: 2.0 },

  //-------- PLANK ------//
  REGULAR_PLANK: { requiredMinSkill: 0, durabilityMultiplier: 1.0 },
  PINE_PLANK: { requiredMinSkill: 10, durabilityMultiplier: 0.9 },
  OAK_PLANK: { requiredMinSkill: 20, durabilityMultiplier: 1.2 },
  ASH_PLANK: { requiredMinSkill: 30, durabilityMultiplier: 1.3 },
  YEW_PLANK: { requiredMinSkill: 50, durabilityMultiplier: 1.6 },
  MAHOGANY_PLANK: { requiredMinSkill: 60, durabilityMultiplier: 1.7 },
  EBONY_PLANK: { requiredMinSkill: 70, durabilityMultiplier: 1.9 },
  BLOOD_PLANK: { requiredMinSkill: 85, durabilityMultiplier: 2.2 },
  GHOST_PLANK: { requiredMinSkill: 95, durabilityMultiplier: 2.5 },

  //-------- LEATHER ------//
  REGULAR_LEATHER: { requiredMinSkill: 0, durabilityMultiplier: 1.0 },
  ROUGH_LEATHER: { requiredMinSkill: 15, durabilityMultiplier: 0.9 },
  REPTILE_LEATHER: { requiredMinSkill: 30, durabilityMultiplier: 1.2 },
  IRON_LEATHER: { requiredMinSkill: 50, durabilityMultiplier: 1.5 },
  DEMON_LEATHER: { requiredMinSkill: 70, durabilityMultiplier: 1.8 },
  DRAGON_LEATHER: { requiredMinSkill: 90, durabilityMultiplier: 2.3 },

  //-------- CURED FUR ------//
  REGULAR_CURED_FUR: { requiredMinSkill: 0, durabilityMultiplier: 0.9 },
  THICK_CURED_FUR: { requiredMinSkill: 20, durabilityMultiplier: 1.1 },
  DARK_CURED_FUR: { requiredMinSkill: 40, durabilityMultiplier: 1.3 },
  SHADOW_CURED_FUR: { requiredMinSkill: 60, durabilityMultiplier: 1.6 },
  SNOW_CURED_FUR: { requiredMinSkill: 80, durabilityMultiplier: 1.9 },

  //-------- CLOTH ------//
  REGULAR_CLOTH: { requiredMinSkill: 0, durabilityMultiplier: 0.7 },

  //-------- BONE ------//
  REGULAR_BONE: { requiredMinSkill: 0, durabilityMultiplier: 0.8 },
} as const satisfies Record<CoreResourceType, ResourceMeta>;
import type { CoreResourceType } from '@/shared/types';

export type CoreResourceTableItem = { requiredMinSkill: number };

export const CORE_RESOURCE_TABLE = {

  //-------- INGOT ------//
  IRON_INGOT: { requiredMinSkill: 0 },
  COPPER_INGOT: { requiredMinSkill: 20 },
  SILVER_INGOT: { requiredMinSkill: 30 },
  GOLD_INGOT: { requiredMinSkill: 40 },
  MITHRIL_INGOT: { requiredMinSkill: 60 },
  ADAMANTINE_INGOT: { requiredMinSkill: 80 },

  //-------- PLANK ------//
  REGULAR_PLANK: { requiredMinSkill: 0 },
  PINE_PLANK: { requiredMinSkill: 10 },
  OAK_PLANK: { requiredMinSkill: 20 },
  ASH_PLANK: { requiredMinSkill: 30 },
  YEW_PLANK: { requiredMinSkill: 50 },
  MAHOGANY_PLANK: { requiredMinSkill: 60 },
  EBONY_PLANK: { requiredMinSkill: 70 },
  BLOOD_PLANK: { requiredMinSkill: 85 },
  GHOST_PLANK: { requiredMinSkill: 95 },

  //-------- LEATHER ------//
  REGULAR_LEATHER: { requiredMinSkill: 0 },
  ROUGH_LEATHER: { requiredMinSkill: 15 },
  REPTILE_LEATHER: { requiredMinSkill: 30 },
  IRON_LEATHER: { requiredMinSkill: 50 },
  DEMON_LEATHER: { requiredMinSkill: 70 },
  DRAGON_LEATHER: { requiredMinSkill: 90 },

  //-------- CURED FUR ------//
  REGULAR_CURED_FUR: { requiredMinSkill: 0 },
  THICK_CURED_FUR: { requiredMinSkill: 20 },
  DARK_CURED_FUR: { requiredMinSkill: 40 },
  SHADOW_CURED_FUR: { requiredMinSkill: 60 },
  SNOW_CURED_FUR: { requiredMinSkill: 80 },

  //-------- CLOTH ------//
  REGULAR_CLOTH: { requiredMinSkill: 0 },

  //-------- BONE ------//
  REGULAR_BONE: { requiredMinSkill: 0 },

} as const satisfies Record<CoreResourceType, CoreResourceTableItem>;
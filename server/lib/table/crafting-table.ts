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

  //-------- LEATHER ------//
  REGULAR_LEATHER: { requiredMinSkill: 0 },

  //-------- LEATHER ------//
  REGULAR_CLOTH: { requiredMinSkill: 0 },


} as const satisfies Record<CoreResourceType, CoreResourceTableItem>;

import type { FishingTileTpe, MiningTileType, OreType, TileType } from '@/shared/types';

export type GatheringTable = { resourceType: OreType | FishingTileTpe; chance: number; requiredMinSkill: number };
 type GatheringResourceTableMap = Record<MiningTileType, GatheringTable[]>;

export const MINING_TABLE = {
  STONE: [
    { resourceType: 'IRON_ORE', chance: 75, requiredMinSkill: 0 },
    { resourceType: 'COPPER_ORE', chance: 10, requiredMinSkill: 30 },
    { resourceType: 'SILVER_ORE', chance: 8, requiredMinSkill: 50 },
    { resourceType: 'GOLD_ORE', chance: 5, requiredMinSkill: 70 },
    { resourceType: 'MITHRIL_ORE', chance: 2, requiredMinSkill: 90 },
  ],

  CAVE: [
    { resourceType: 'IRON_ORE', chance: 40, requiredMinSkill: 0 },
    { resourceType: 'SILVER_ORE', chance: 20, requiredMinSkill: 50 },
    { resourceType: 'GOLD_ORE', chance: 15, requiredMinSkill: 70 },
    { resourceType: 'MITHRIL_ORE', chance: 15, requiredMinSkill: 90 },
    { resourceType: 'ADAMANTINE_ORE', chance: 10, requiredMinSkill: 105 },
  ],
} as const satisfies GatheringResourceTableMap;

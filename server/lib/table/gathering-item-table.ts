
import type { FishingTileTpe, MiningTileType, OreType, TileType } from '@/shared/types';

export type GatheringItemTable = { itemKey: OreType | FishingTileTpe; chance: number; requiredMinSkill: number; maxGatherQuantity: number };

export const MINING_TABLE = {
  STONE: [
    { itemKey: 'IRON_ORE', chance: 75, requiredMinSkill: 0, maxGatherQuantity: 4 },
    { itemKey: 'COPPER_ORE', chance: 10, requiredMinSkill: 30, maxGatherQuantity: 3 },
    { itemKey: 'SILVER_ORE', chance: 8, requiredMinSkill: 50, maxGatherQuantity: 2 },
    { itemKey: 'GOLD_ORE', chance: 5, requiredMinSkill: 70, maxGatherQuantity: 1 },
    { itemKey: 'MITHRIL_ORE', chance: 2, requiredMinSkill: 90, maxGatherQuantity: 1 },
  ],

  CAVE: [
    {
      itemKey: 'IRON_ORE',
      chance: 40,
      requiredMinSkill: 0,
      maxGatherQuantity: 4,
    },
    {
      itemKey: 'SILVER_ORE',
      chance: 20,
      requiredMinSkill: 50,
      maxGatherQuantity: 2,
    },
    {
      itemKey: 'GOLD_ORE',
      chance: 15,
      requiredMinSkill: 70,
      maxGatherQuantity: 1,
    },
    {
      itemKey: 'MITHRIL_ORE',
      chance: 15,
      requiredMinSkill: 90,
      maxGatherQuantity: 1,
    },
    {
      itemKey: 'ADAMANTINE_ORE',
      chance: 10,
      requiredMinSkill: 95,
      maxGatherQuantity: 1,
    },
  ],
} as const satisfies Record<MiningTileType, GatheringItemTable[]>;

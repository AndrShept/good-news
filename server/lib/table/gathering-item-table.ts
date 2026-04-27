import type {
  ClothType,
  FiberType,
  FishType,
  FishingTileType,
  FlowerType,
  ForagingTileType,
  HerbsType,
  LogType,
  LumberTileType,
  MiningTileType,
  MushroomType,
  OreType,
  TileType,
} from '@/shared/types';

export type MiningItemTable = { itemKey: OreType; chance: number; requiredMinSkill: number; maxGatherQuantity: number };

export const MINING_TABLE = {
  ROCKY_FIELD: [
    { itemKey: 'IRON_ORE', chance: 75, requiredMinSkill: 0, maxGatherQuantity: 4 },
    { itemKey: 'COPPER_ORE', chance: 15, requiredMinSkill: 15, maxGatherQuantity: 3 },
    { itemKey: 'SILVER_ORE', chance: 7, requiredMinSkill: 35, maxGatherQuantity: 2 },
    { itemKey: 'GOLD_ORE', chance: 3, requiredMinSkill: 60, maxGatherQuantity: 1 },
  ],
  CAVE: [
    { itemKey: 'IRON_ORE', chance: 35, requiredMinSkill: 0, maxGatherQuantity: 4 },
    { itemKey: 'COPPER_ORE', chance: 25, requiredMinSkill: 15, maxGatherQuantity: 3 },
    { itemKey: 'SILVER_ORE', chance: 20, requiredMinSkill: 35, maxGatherQuantity: 2 },
    { itemKey: 'GOLD_ORE', chance: 12, requiredMinSkill: 60, maxGatherQuantity: 1 },
    { itemKey: 'MITHRIL_ORE', chance: 8, requiredMinSkill: 80, maxGatherQuantity: 1 },
  ],
  MOUNTAIN: [
    { itemKey: 'IRON_ORE', chance: 30, requiredMinSkill: 0, maxGatherQuantity: 4 },
    { itemKey: 'COPPER_ORE', chance: 20, requiredMinSkill: 15, maxGatherQuantity: 3 },
    { itemKey: 'SILVER_ORE', chance: 18, requiredMinSkill: 35, maxGatherQuantity: 2 },
    { itemKey: 'GOLD_ORE', chance: 15, requiredMinSkill: 60, maxGatherQuantity: 2 },
    { itemKey: 'MITHRIL_ORE', chance: 12, requiredMinSkill: 80, maxGatherQuantity: 1 },
    { itemKey: 'ADAMANTINE_ORE', chance: 5, requiredMinSkill: 95, maxGatherQuantity: 1 },
  ],
} satisfies Record<MiningTileType, MiningItemTable[]>;

export type WoodCuttingItemTable = { itemKey: LogType; chance: number; requiredMinSkill: number; maxGatherQuantity: number };

export const WOODCUTTING_TABLE = {
  FOREST: [
    { itemKey: 'REGULAR_LOG', chance: 60, requiredMinSkill: 0, maxGatherQuantity: 3 },
    { itemKey: 'PINE_LOG', chance: 25, requiredMinSkill: 10, maxGatherQuantity: 2 },
    { itemKey: 'OAK_LOG', chance: 12, requiredMinSkill: 20, maxGatherQuantity: 2 },
    { itemKey: 'ASH_LOG', chance: 3, requiredMinSkill: 40, maxGatherQuantity: 1 },
  ],
  DENSE_FOREST: [
    { itemKey: 'REGULAR_LOG', chance: 20, requiredMinSkill: 0, maxGatherQuantity: 3 },
    { itemKey: 'OAK_LOG', chance: 30, requiredMinSkill: 20, maxGatherQuantity: 3 },
    { itemKey: 'ASH_LOG', chance: 25, requiredMinSkill: 40, maxGatherQuantity: 2 },
    { itemKey: 'YEW_LOG', chance: 15, requiredMinSkill: 60, maxGatherQuantity: 2 },
    { itemKey: 'MAHOGANY_LOG', chance: 10, requiredMinSkill: 75, maxGatherQuantity: 1 },
  ],
  ANCIENT_FOREST: [
    { itemKey: 'REGULAR_LOG', chance: 10, requiredMinSkill: 0, maxGatherQuantity: 3 },
    { itemKey: 'YEW_LOG', chance: 28, requiredMinSkill: 60, maxGatherQuantity: 2 },
    { itemKey: 'MAHOGANY_LOG', chance: 25, requiredMinSkill: 75, maxGatherQuantity: 2 },
    { itemKey: 'EBONY_LOG', chance: 18, requiredMinSkill: 85, maxGatherQuantity: 1 },
    { itemKey: 'BLOOD_LOG', chance: 12, requiredMinSkill: 92, maxGatherQuantity: 1 },
    { itemKey: 'GHOST_LOG', chance: 7, requiredMinSkill: 98, maxGatherQuantity: 1 },
  ],
} satisfies Record<LumberTileType, WoodCuttingItemTable[]>;

export type FishingItemTable = { itemKey: FishType; chance: number; requiredMinSkill: number; maxGatherQuantity: number };

export const FISHING_TABLE = {
  RIVER: [
    { itemKey: 'SMALL_FISH', chance: 45, requiredMinSkill: 0, maxGatherQuantity: 4 },
    { itemKey: 'PERCH', chance: 30, requiredMinSkill: 10, maxGatherQuantity: 3 },
    { itemKey: 'CARP', chance: 15, requiredMinSkill: 25, maxGatherQuantity: 2 },
    { itemKey: 'CATFISH', chance: 10, requiredMinSkill: 40, maxGatherQuantity: 2 },
  ],
  LAKE: [
    { itemKey: 'SMALL_FISH', chance: 30, requiredMinSkill: 0, maxGatherQuantity: 4 },
    { itemKey: 'PERCH', chance: 25, requiredMinSkill: 10, maxGatherQuantity: 3 },
    { itemKey: 'CARP', chance: 20, requiredMinSkill: 25, maxGatherQuantity: 2 },
    { itemKey: 'CATFISH', chance: 12, requiredMinSkill: 40, maxGatherQuantity: 2 },
    { itemKey: 'SALMON', chance: 8, requiredMinSkill: 55, maxGatherQuantity: 1 },
    { itemKey: 'PUFFERFISH', chance: 5, requiredMinSkill: 70, maxGatherQuantity: 1 },
  ],
  SEA: [
    { itemKey: 'SMALL_FISH', chance: 20, requiredMinSkill: 0, maxGatherQuantity: 4 },
    { itemKey: 'SALMON', chance: 22, requiredMinSkill: 20, maxGatherQuantity: 3 },
    { itemKey: 'TUNA', chance: 20, requiredMinSkill: 40, maxGatherQuantity: 2 },
    { itemKey: 'ANGLERFISH', chance: 15, requiredMinSkill: 60, maxGatherQuantity: 1 },
    { itemKey: 'SQUID', chance: 10, requiredMinSkill: 72, maxGatherQuantity: 1 },
    { itemKey: 'SHARK', chance: 8, requiredMinSkill: 85, maxGatherQuantity: 1 },
    { itemKey: 'JELLYFISH', chance: 5, requiredMinSkill: 93, maxGatherQuantity: 1 },
  ],
} satisfies Record<FishingTileType, FishingItemTable[]>;

export type ForagingItemTable = {
  itemKey: FlowerType | MushroomType | HerbsType | FiberType;
  chance: number;
  requiredMinSkill: number;
  maxGatherQuantity: number;
};

export const FORAGING_TABLE = {
  MEADOW: [
    { itemKey: 'FLAX', chance: 35, requiredMinSkill: 0, maxGatherQuantity: 3 },
    { itemKey: 'SUNFLOWER', chance: 20, requiredMinSkill: 5, maxGatherQuantity: 2 },
    { itemKey: 'ROSE', chance: 15, requiredMinSkill: 10, maxGatherQuantity: 2 },
    { itemKey: 'GREENLEAF', chance: 10, requiredMinSkill: 15, maxGatherQuantity: 2 },
    { itemKey: 'SWIFTLEAF', chance: 8, requiredMinSkill: 25, maxGatherQuantity: 2 },
    { itemKey: 'COTTON', chance: 6, requiredMinSkill: 35, maxGatherQuantity: 2 },
    { itemKey: 'SUNGRASS', chance: 4, requiredMinSkill: 50, maxGatherQuantity: 1 },
    { itemKey: 'FIRE_BLOSSOM', chance: 2, requiredMinSkill: 70, maxGatherQuantity: 1 },
  ],
  PLAINS: [
    { itemKey: 'GREENLEAF', chance: 30, requiredMinSkill: 0, maxGatherQuantity: 3 },
    { itemKey: 'FLAX', chance: 25, requiredMinSkill: 5, maxGatherQuantity: 3 },
    { itemKey: 'SWIFTLEAF', chance: 15, requiredMinSkill: 15, maxGatherQuantity: 2 },
    { itemKey: 'SUNGRASS', chance: 10, requiredMinSkill: 30, maxGatherQuantity: 2 },
    { itemKey: 'COTTON', chance: 8, requiredMinSkill: 45, maxGatherQuantity: 2 },
    { itemKey: 'JASMINE', chance: 6, requiredMinSkill: 55, maxGatherQuantity: 1 },
    { itemKey: 'BLOOD_HERB', chance: 4, requiredMinSkill: 75, maxGatherQuantity: 1 },
    { itemKey: 'FROST_LILY', chance: 2, requiredMinSkill: 90, maxGatherQuantity: 1 },
  ],
  SWAMP: [
    { itemKey: 'BITTERROOT', chance: 25, requiredMinSkill: 10, maxGatherQuantity: 3 },
    { itemKey: 'GLOWCAP_MUSHROOM', chance: 20, requiredMinSkill: 20, maxGatherQuantity: 2 },
    { itemKey: 'SHADOWCAP_MUSHROOM', chance: 18, requiredMinSkill: 35, maxGatherQuantity: 2 },
    { itemKey: 'IRONCAP_MUSHROOM', chance: 15, requiredMinSkill: 50, maxGatherQuantity: 1 },
    { itemKey: 'SPORECAP_MUSHROOM', chance: 10, requiredMinSkill: 65, maxGatherQuantity: 1 },
    { itemKey: 'BLOOD_HERB', chance: 8, requiredMinSkill: 75, maxGatherQuantity: 1 },
    { itemKey: 'GHOST_HERB', chance: 4, requiredMinSkill: 88, maxGatherQuantity: 1 },
  ],

  FOREST: [
    { itemKey: 'GREENLEAF', chance: 35, requiredMinSkill: 0, maxGatherQuantity: 3 },
    { itemKey: 'REDCAP_MUSHROOM', chance: 25, requiredMinSkill: 5, maxGatherQuantity: 3 },
    { itemKey: 'ROSE', chance: 15, requiredMinSkill: 10, maxGatherQuantity: 2 },
    { itemKey: 'BITTERROOT', chance: 12, requiredMinSkill: 20, maxGatherQuantity: 2 },
    { itemKey: 'GLOWCAP_MUSHROOM', chance: 8, requiredMinSkill: 30, maxGatherQuantity: 2 },
    { itemKey: 'BLUE_ORCHID', chance: 5, requiredMinSkill: 45, maxGatherQuantity: 1 },
  ],
  DENSE_FOREST: [
    { itemKey: 'BITTERROOT', chance: 25, requiredMinSkill: 15, maxGatherQuantity: 3 },
    { itemKey: 'GLOWCAP_MUSHROOM', chance: 20, requiredMinSkill: 25, maxGatherQuantity: 2 },
    { itemKey: 'BLUE_ORCHID', chance: 18, requiredMinSkill: 40, maxGatherQuantity: 2 },
    { itemKey: 'SHADOWCAP_MUSHROOM', chance: 15, requiredMinSkill: 55, maxGatherQuantity: 1 },
    { itemKey: 'GHOST_HERB', chance: 12, requiredMinSkill: 75, maxGatherQuantity: 1 },
    { itemKey: 'NIGHT_BLOOM', chance: 10, requiredMinSkill: 85, maxGatherQuantity: 1 },
  ],
} satisfies Record<ForagingTileType, ForagingItemTable[]>;

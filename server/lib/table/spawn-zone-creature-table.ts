import type { CreatureKey } from '@/shared/templates/creature-template';
import type { SpawnCreatureTileType } from '@/shared/types';

export const SPAWN_ZONE_CREATURE_TABLE: Record<
  SpawnCreatureTileType,
  {
    density: number;
    creatures: CreatureKey[];
    respawnTime: number;
  }
> = {
  FARM: { density: 2, respawnTime: 10_000, creatures: ['PIG', 'COW', 'BULL', 'SHEEP', 'CHICKEN'] },
  MEADOW: { density: 2, respawnTime: 10_000, creatures: ['RABBIT', 'DEER', 'BUTTERFLY'] },
  PLAINS: { density: 2, respawnTime: 10_000, creatures: ['RABBIT', 'WILD_DOG', 'CROW'] },
  FOREST: { density: 2, respawnTime: 10_000, creatures: ['BOAR', 'FOX', 'WOLF'] },
  DENSE_FOREST: { density: 2, respawnTime: 10_000, creatures: ['WOLF', 'BEAR'] },
  ROCKY_FIELD: { density: 2, respawnTime: 10_000, creatures: ['LIZARD', 'SNAKE', 'SCORPION', 'SPIDER', 'GOBLIN_SCOUT'] },
  ANCIENT_FOREST: { density: 0, respawnTime: 10_000, creatures: [] }, // ['treant', 'ancient_wolf', 'forest_spirit']
  MOUNTAIN: { density: 2, respawnTime: 10_000, creatures: ['MOUNTAIN_GOAT', 'HARPY', 'ROCK_TROLL'] },
  CAVE: { density: 0, respawnTime: 10_000, creatures: [] }, //['bat', 'cave_spider', 'cave_troll']
  LAKE: { density: 0, respawnTime: 10_000, creatures: [] }, // 'duck', 'crocodile', 'lake_serpent'
  RIVER: { density: 2, respawnTime: 10_000, creatures: ['FROG', 'DUCK'] }, // 'duck', 'crocodile', 'lake_serpent'

  SWAMP: { density: 0, respawnTime: 10_000, creatures: [] }, // ['giant_frog', 'swamp_witch', 'bog_horror']
};

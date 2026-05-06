import type { CreatureKey } from '@/shared/templates/creature-template';
import type { SpawnCreatureTileType } from '@/shared/types';

export const SPAWN_ZONE_CREATURE_TABLE: Record<
  SpawnCreatureTileType,
  {
    density: number;
    creatures: CreatureKey[];
  }
> = {
  MEADOW: { density: 2, creatures: ['RABBIT', 'DEER', 'BUTTERFLY'] },
  PLAINS: { density: 2, creatures: ['RABBIT', 'WILD_DOG'] },
  FARM: { density: 2, creatures: ['PIG', 'COW', 'BULL', 'SHEEP', 'CHICKEN'] },
  ROCKY_FIELD: { density: 2, creatures: ['LIZARD', 'SNAKE', 'SCORPION', 'SPIDER', 'GOBLIN_SCOUT'] },
  FOREST: { density: 2, creatures: ['BOAR', 'FOX', 'WOLF'] },
  DENSE_FOREST: { density: 2, creatures: ['WOLF', 'BEAR'] },
  ANCIENT_FOREST: { density: 0, creatures: [] }, // ['treant', 'ancient_wolf', 'forest_spirit']
  MOUNTAIN: { density: 2, creatures: ['MOUNTAIN_GOAT', 'HARPY', 'ROCK_TROLL'] },
  CAVE: { density: 0, creatures: [] }, //['bat', 'cave_spider', 'cave_troll']
  LAKE: { density: 0, creatures: [] }, // 'duck', 'crocodile', 'lake_serpent'
  SWAMP: { density: 0, creatures: [] }, // ['giant_frog', 'swamp_witch', 'bog_horror']
};

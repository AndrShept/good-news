import type { IHeroStat } from './types';

export const BASE_STATS: IHeroStat = {
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  wisdom: 10,
  constitution: 10,
  luck: 5,
};

export const BASE_FREE_POINTS = 10;
export const RESET_STATS_COST = 100;

export const BASE_HEALTH_REGEN_TIME = 10000;
export const BASE_MANA_REGEN_TIME = 7000;
export const BASE_WALK_TIME = 3000;
export const HP_MULTIPLIER_COST = 10;
export const MANA_MULTIPLIER_INT = 15;
export const MAX_QUEUE_CRAFT_ITEM = 3

export const DEFAULT_ITEM_STACK = {
  RESOURCE: 20,
  POTION: 10,
  GOLD: 1000,
} as const;

export const BANK_CONTAINER_COST = 100;

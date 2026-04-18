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

export const BANK_CONTAINER_COST = 100;
export const MAX_QUEUE_CRAFT_ITEM = 3;

export const RESET_STATS_COST = 100;

export const DEFAULT_ITEM_STACK = {
  RESOURCE: 20,
  FOOD: 20,
  POTION: 10,
  GOLD: 1000,
} as const;

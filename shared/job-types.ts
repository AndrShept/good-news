import type { BuildingType, IPosition } from './types';

export const jobName = {
  'walk-map': 'WALK_PLACE',
  'walk-place': 'WALK_PLACE',
  'hero-offline': 'HERO_OFFLINE',
  'buff-create': 'BUFF_CREATE',
  'regen-health': 'REGEN_HEALTH',
  'regen-mana': 'REGEN_MANA',
} as const;

export type JobNameType = (typeof jobName)[keyof typeof jobName];

export type ActionJobEvent = WalkPlaceJob | WalkMapJob | HeroOfflineJob | BuffCreateJob | RegenHealthJob | RegenManaJob;

export type WalkPlaceJob = {
  jobName: 'WALK_PLACE';
  payload: {
    actionId: string;
    locationId: string;
    heroId: string;
    type: 'IDLE';
    buildingType: BuildingType;
  };
};
export type WalkMapJob = {
  jobName: 'WALK_MAP';
  payload: {
    heroId: string;
    actionId: string;
    newPosition: IPosition;
    mapId: string;
  };
};
export type HeroOfflineJob = {
  jobName: 'HERO_OFFLINE';
  payload: {
    heroId: string;
    mapId: string | undefined;
    placeId: string | undefined;
  };
};
export type BuffCreateJob = {
  jobName: 'BUFF_CREATE';
  payload: {
    heroId: string;
    gameItemId: string;
  };
};
export type RegenHealthJob = {
  jobName: 'REGEN_HEALTH';
  payload: {
    heroId: string;
    currentHealth?: number;
    isComplete?: boolean;
  };
};
export type RegenManaJob = {
  jobName: 'REGEN_MANA';
  payload: {
    heroId: string;
    currentMana?: number;
    isComplete?: boolean;
  };
};

import type { Hero, Tile, buildingNameType } from './types';

export const jobName = {
  'walk-map': 'WALK_MAP',
  'walk-town': 'WALK_TOWN',
} as const;

export type JobNameType = (typeof jobName)[keyof typeof jobName];

export type ActionJobEvent = WalkTownJob | WalkMapJob;

export type WalkTownJob = {
  jobName: 'WALK_TOWN';
  payload: {
    actionId: string;
    locationId: string;
    heroId: string;
    type: 'IDLE';
    buildingName: buildingNameType;
  };
};
export type WalkMapJob = {
  jobName: 'WALK_MAP';
  payload: {
    type: 'IDLE';
    targetTileId: string;
    currentTileId: string;
    hero: Hero;
    tile: Tile;
  };
};

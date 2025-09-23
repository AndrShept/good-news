import type { Hero, IPosition, Tile, buildingNameType } from './types';

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
    heroId: string;
    tileId: string;
    actionId: string;
    newPosition : IPosition
    mapId: string
  };
};

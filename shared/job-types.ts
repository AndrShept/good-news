import type { BuildingType, CoreMaterialType, IPosition, ResourceType } from './types';

export const jobName = {
  'hero-offline': 'HERO_OFFLINE',
  'buff-create': 'BUFF_CREATE',
  'regen-health': 'REGEN_HEALTH',
  'regen-mana': 'REGEN_MANA',
  'queue-craft-item': 'QUEUE_CRAFT_ITEM',
} as const;

export type JobNameType = (typeof jobName)[keyof typeof jobName];

export type ActionJobEvent =  HeroOfflineJob | BuffCreateJob | RegenHealthJob | RegenManaJob | QueueCraftItemJob;



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

export type QueueCraftItemJob = {
  jobName: 'QUEUE_CRAFT_ITEM';
  payload: {
    heroId: string;
    queueCraftItemId: string;
    coreMaterialType?: CoreMaterialType;
    craftExpMessage?: string;
    completedAt?: string;
    gameItemName?: string;
    isLuckyCraft?: boolean;
    buildingType: BuildingType;
  };
};

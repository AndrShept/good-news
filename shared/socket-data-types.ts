import type {
  Corpse,
  EntityPayloadMap,
  GameSysMessageType,
  Hero,
  HeroSidebarItem,
  ItemsInstanceDeltaEvent,
  MapChunkEntitiesData,
  MapChunkEntitiesType,
  MapCorpse,
  MapCreature,
  MapHero,
  OmitDeepHero,
  QueueCraftStatusType,
} from './types';

export type SocketGroupResponse = {
  message: string;
  groupId?: string;
  memberId?: string;
  messageColor?: GameSysMessageType;
  updateType: 'leave' | 'kick' | 'remove' | 'new-member';
};

export type MapChunkEntitiesDataPartial = {
  [K in keyof EntityPayloadMap]: {
    type: K;
    payload: Partial<EntityPayloadMap[K]>;
  };
}[keyof EntityPayloadMap];

export type MapChunkSpawnEntityData = MapChunkEntitiesData;

export type MapChunkDespawnEntityData = {
  type: MapChunkEntitiesType;
  payload: {
    entityIds: string[];
  };
};

export type MapChunkUpdateEntitiesData = {
  entityId: string;
  isFinishMove?: boolean;
  data: MapChunkEntitiesDataPartial;
};

export type PlaceUpdateEvent =
  | {
      type: 'ADD_HERO';
      payload: {
        hero: HeroSidebarItem;
        placeId: string;
      };
    }
  | {
      type: 'REMOVE_HERO';
      payload: { heroId: string };
    };

export type HeroOfflineEvent = {
  type: 'HERO_OFFLINE';
  payload: { heroId: string; placeId?: string; mapId?: string };
};
export type HeroOnlineEvent = {
  type: 'HERO_ONLINE';
  payload: MapHero;
};

export type QueueCraftItemSocketEvent =
  | {
      type: 'COMPLETE';
      payload: {
        queueItemCraftId: string;
        itemName: string;
        message: string;
        successCraft: boolean;
        itemsDelta: ItemsInstanceDeltaEvent[] | undefined;
      };
    }
  | {
      type: 'FAILED';
      payload: {
        itemName?: string;
        queueItemCraftId: string;
        message: string;
      };
    }
  | {
      type: 'UPDATE';
      payload: { queueItemCraftId: string; status: QueueCraftStatusType; expiresAt: number };
    };

export type SelfHeroEvent =
  | RemoveBuffEvent
  | SkillExpGainEvent
  | HeroUpdateEvent
  | FinishGatheringEvent
  | LoadMapChunkEntityEvent
  | RemoveMapChunkEntityEvent
  | UpdateItemDeltaEvent;

export type UpdateItemDeltaEvent = {
  type: 'ITEM_DELTA';
  payload: {
    itemsDelta: ItemsInstanceDeltaEvent[];
  };
};

export type LoadMapChunkEntityEvent = {
  type: 'LOAD_MORE_ENTITY';
  payload: {
    corpses: MapCorpse[];
    creatures: MapCreature[];
    heroes: MapHero[];
  };
};
export type RemoveMapChunkEntityEvent = {
  type: 'REMOVE_OLD_ENTITY';
  payload: {
    corpses: string[];
    creatures: string[];
    heroes: string[];
  };
};

export type HeroUpdateEvent = {
  type: 'UPDATE_HERO';
  heroId: string;
  payload: Partial<OmitDeepHero>;
};

export type RemoveBuffEvent = {
  type: 'REMOVE_BUFF';
  payload: {
    buffInstanceId: string;
    hero?: Pick<Hero, 'currentHealth' | 'maxHealth' | 'currentMana' | 'maxMana' | 'modifier'>;
  };
};
export type FinishGatheringEvent = {
  type: 'FINISH_GATHERING';
  payload: {
    itemName?: string;
    quantity?: number;
    message: string;
    inventoryDeltas?: ItemsInstanceDeltaEvent[];
    equipmentDeltas?: ItemsInstanceDeltaEvent[];
  };
};
export type SkillExpGainEvent = {
  type: 'SKILL_EXP_GAIN';
  heroId: string;
  payload: { isShowMessageOnlyLvlUp: boolean; expResult: SkillExpGainEventPayload }[];
};

export type SkillExpGainEventPayload = {
  message: string;
  isLevelUp: boolean;
  skillInstanceId: string;
  level: number;
  currentExperience: number;
  expToLvl: number;
};

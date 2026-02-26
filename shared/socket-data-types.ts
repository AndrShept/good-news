import type { itemInstanceService } from '../server/services/item-instance-service';
import type {
  BuildingType,
  GameSysMessageType,
  Hero,
  HeroSidebarItem,
  MapHero,
  QueueCraftStatusType,
  SkillInstance,
  StateType,
  TItemContainer,
  itemsInstanceDeltaEvent,
} from './types';

export type SocketGroupResponse = {
  message: string;
  groupId?: string;
  memberId?: string;
  messageType?: GameSysMessageType;
  updateType: 'leave' | 'kick' | 'remove' | 'new-member';
};

export type MapUpdateEvent =
  | {
      type: 'REMOVE_HERO';
      payload: {
        heroId: string;
      };
    }
  | {
      type: 'ADD_HERO';
      payload: { hero: MapHero; mapId: string };
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
        itemsDelta: itemsInstanceDeltaEvent[] | undefined;
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

export type SelfHeroEvent = RemoveBuffEvent | SkillUpEvent | HeroUpdateStateEvent | FinishGatheringEvent;

export type HeroUpdateStateEvent = {
  type: 'UPDATE_STATE';
  payload: {
    state: StateType;
    heroId: string;
  };
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
    inventoryDeltas?: itemsInstanceDeltaEvent[];
    equipmentDeltas?: itemsInstanceDeltaEvent[];
  };
};
export type SkillUpEvent = {
  type: 'SKILL_UP';
  payload: {
    skill: SkillInstance;
    message: string;
    expAmount: number;
  };
};

export type WalkMapStartEvent = {
  type: 'WALK_MAP_START';
  payload: {
    state: StateType;
    heroId: string;
  };
};
export type WalkMapUpdateEvent = {
  type: 'WALK_MAP_UPDATE';
  payload: {
    x: number;
    y: number;
    heroId: string;
  };
};
export type WalkMapCompleteEvent = {
  type: 'WALK_MAP_COMPLETE';
  payload: {
    state: StateType;
    heroId: string;
  };
};

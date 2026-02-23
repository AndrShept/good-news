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
} from './types';

export type SocketGroupResponse = {
  message: string;
  groupId?: string;
  memberId?: string;
  messageType?: GameSysMessageType;
  updateType: 'leave' | 'kick' | 'remove' | 'new-member';
};

export type MapUpdateData =
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

export type PlaceUpdateData =
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

export type HeroOfflineData = {
  type: 'HERO_OFFLINE';
  payload: { heroId: string; placeId?: string; mapId?: string };
};
export type HeroOnlineData = {
  type: 'HERO_ONLINE';
  payload: MapHero;
};

export type QueueCraftItemSocketData =
  | {
      type: 'COMPLETE';
      payload: {
        queueItemCraftId: string;
        itemName: string;
        message: string;
        successCraft: boolean;
        backpack: TItemContainer;
        // expResult: { message: string; amount: number; isLevelUp: boolean };
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

export type SelfHeroData = RemoveBuffData | SkillUpData | HeroUpdateStateData | FinishGatheringData;

export type HeroUpdateStateData = {
  type: 'UPDATE_STATE';
  payload: {
    state: StateType;
    heroId: string;
  };
};

export type RemoveBuffData = {
  type: 'REMOVE_BUFF';
  payload: {
    buffInstanceId: string;
    hero?: Pick<Hero, 'currentHealth' | 'maxHealth' | 'currentMana' | 'maxMana' | 'modifier'>;
  };
};
export type FinishGatheringData = {
  type: 'FINISH_GATHERING';
  payload: { heroId: string; backpack?: TItemContainer; itemName?: string; quantity?: number; message: string };
};
export type SkillUpData = {
  type: 'SKILL_UP';
  payload: {
    skill: SkillInstance;
    message: string;
    expAmount: number;
  };
};

export type WalkMapStartData = {
  type: 'WALK_MAP_START';
  payload: {
    state: StateType;
    heroId: string;
  };
};
export type WalkMapUpdateData = {
  type: 'WALK_MAP_UPDATE';
  payload: {
    x: number;
    y: number;
    heroId: string;
  };
};
export type WalkMapCompleteData = {
  type: 'WALK_MAP_COMPLETE';
  payload: {
    state: StateType;
    heroId: string;
  };
};

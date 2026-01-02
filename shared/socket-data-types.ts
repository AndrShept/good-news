import type { GameMessageType } from '../frontend/src/store/useGameMessages';
import type { BuffCreateJob, QueueCraftItemJob, RegenHealthJob, RegenManaJob } from './job-types';
import type { BuildingType, GameItem, HeroSidebarItem, Location, MapHero, QueueCraftStatusType, StateType } from './types';

export type SocketGroupResponse = {
  message: string;
  groupId?: string;
  memberId?: string;
  messageType?: GameMessageType;
  updateType: 'leave' | 'kick' | 'remove' | 'new-member';
};

export type MapUpdateEvent =
  | {
      type: 'HERO_ENTER_PLACE';
      payload: {
        heroId: string;
        placeId: string;
      };
    }
  | {
      type: 'HERO_LEAVE_PLACE';
      payload: { hero: MapHero; mapId: string; heroId: string };
    };

export type PlaceUpdateEvent =
  | {
      type: 'HERO_ENTER_PLACE';
      payload: HeroSidebarItem;
    }
  | {
      type: 'HERO_LEAVE_PLACE';
      payload: { heroId: string; mapId: string };
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
      type: 'QUEUE_CRAFT_ITEM_COMPLETE';
      payload: {
        queueItemCraftId: string;
        gameItemName: string;
        craftExpMessage: string;
        buildingType: BuildingType;
        isLuckyCraft: boolean;
      };
    }
  | {
      type: 'QUEUE_CRAFT_ITEM_STATUS_UPDATE';
      payload: { queueItemCraftId: string; status: QueueCraftStatusType; completedAt: string; buildingType: BuildingType };
    };

export type SelfMessageData = { message: string; type: GameMessageType };

export type SelfHeroData = BuffCreateJob | RegenHealthJob | RegenManaJob | QueueCraftItemJob;

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

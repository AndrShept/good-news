import type { GameMessageType } from '../frontend/src/store/useGameMessages';
import type { WalkMapJob, WalkPlaceJob } from './job-types';
import type {  Location, } from './types';

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
      payload: { location: Location; mapId: string; heroId: string };
    }
  | {
      type: 'WALK_MAP';
      payload: WalkMapJob['payload'];
    };

export type PlaceUpdateEvent =
  | {
      type: 'HERO_ENTER_PLACE';
      payload: Location;
    }
  | {
      type: 'HERO_LEAVE_PLACE';
      payload: { heroId: string; mapId: string };
    }
  | {
      type: 'WALK_PLACE';
      payload: WalkPlaceJob['payload'];
    };

export type HeroOfflineData = {
  type: 'HERO_OFFLINE';
  payload: { heroId: string; placeId?: string; mapId?: string };
};
export type HeroOnlineData = {
  type: 'HERO_ONLINE';
  payload: Location;
};

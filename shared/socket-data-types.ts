import type { GameMessageType, IGameMessage } from '../frontend/src/store/useGameMessages';
import type { WalkMapJob, WalkTownJob } from './job-types';
import type { Hero, IPosition, Location, Tile, Town } from './types';

export type SocketGroupResponse = {
  message: string;
  groupId?: string;
  memberId?: string;
  messageType?: GameMessageType;
  updateType: 'leave' | 'kick' | 'remove' | 'new-member';
};

export type MapUpdateEvent =
  | {
      type: 'HERO_ENTER_TOWN';
      payload: {
        heroId: string;
        townId: string;
      };
    }
  | {
      type: 'HERO_LEAVE_TOWN';
      payload: { location: Location; mapId: string; heroId: string };
    }
  | {
      type: 'WALK_MAP';
      payload: WalkMapJob['payload'];
    };

export type TownUpdateEvent =
  | {
      type: 'HERO_ENTER_TOWN';
      payload: Location;
    }
  | {
      type: 'HERO_LEAVE_TOWN';
      payload: { heroId: string; mapId: string };
    }
  | {
      type: 'WALK_TOWN';
      payload: WalkTownJob['payload'];
    };

export type HeroOfflineData = {
  type: 'HERO_OFFLINE';
  payload: { heroId: string; townId?: string; mapId?: string };
};
export type HeroOnlineData = {
  type: 'HERO_ONLINE';
  payload: Location;
};

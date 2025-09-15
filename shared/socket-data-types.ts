import type { GameMessageType, IGameMessage } from '../frontend/src/store/useGameMessages';
import type { WalkMapJob, WalkTownJob } from './job-types';
import type { Hero, Tile, Town } from './types';

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
        town: Town;
        tileId: string;
        hero: Hero;
      };
    }
  | {
      type: 'HERO_LEAVE_TOWN';
      payload: { heroId: string; mapId: string; tileId: string; hero: Hero };
    }
  | {
      type: 'WALK_MAP';
      payload: WalkMapJob['payload'];
    };

export type TownUpdateEvent =
  | {
      type: 'HERO_ENTER_TOWN';
      payload: {
        heroId: string;
        townId: string;
        tileId: string;
        hero: Hero;
      };
    }
  | {
      type: 'HERO_LEAVE_TOWN';
      payload: { heroId: string; mapId: string; tileId: string; tile: Tile };
    }
  | {
      type: 'WALK_TOWN';
      payload: WalkTownJob['payload'];
    };

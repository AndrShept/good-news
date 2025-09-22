import type { GameMessageType, IGameMessage } from '../frontend/src/store/useGameMessages';
import type { WalkMapJob, WalkTownJob } from './job-types';
import type { Hero, IPosition, Tile, Town } from './types';

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
        pos: IPosition;
      };
    }
  | {
      type: 'HERO_LEAVE_TOWN';
      payload: Tile;
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
      payload: { heroId: string; mapId: string};
    }
  | {
      type: 'WALK_TOWN';
      payload: WalkTownJob['payload'];
    };

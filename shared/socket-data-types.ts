import type { GameMessageType, IGameMessage } from '../frontend/src/store/useGameMessages';
import type { Hero, Tile, Town, WalkMapJobData, WalkTownJobData } from './types';

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
        town: Town
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
      payload: WalkMapJobData;
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
      payload: WalkTownJobData;
    };

import type { GameMessageType, IGameMessage } from '../frontend/src/store/useGameMessages';
import type { Hero, Tile, Town } from './types';

export type SocketGroupResponse = {
  message: string;
  groupId?: string;
  memberId?: string;
  messageType?: GameMessageType;
  updateType: 'leave' | 'kick' | 'remove' | 'new-member';
};
export type SocketEnterTownResponse = {
  townId: string;
  heroId: string;
  tileId: string;
};
export type SocketLeaveTownResponse = {
  heroId: string;
  mapId: string;
  tileId: string;
  hero: Hero;
};

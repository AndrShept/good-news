import type { HeroUpdateStateData, MapUpdateData, PlaceUpdateData, SkillUpData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { GameSysMessage, StateType } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { serverState } from '../game/state/server-state';
import { heroService } from './hero-service';
import { skillService } from './skill-service';

interface SendToClientExpResult {
  heroId: string;
  expResult: ReturnType<typeof skillService.addExp>;
  onlyLevelUp?: boolean;
}

export const socketService = {
  getSocket(heroId: string) {
    const socket = serverState.socket.get(heroId);
    if (!socket) {
      throw new HTTPException(404, { message: 'socket not found' });
    }
    return socket;
  },

  sendToPlaceUpdateState(heroId: string, placeId: string | null, state: StateType) {
    if (!placeId) return;
    const socketData: HeroUpdateStateData = {
      type: 'UPDATE_STATE',
      payload: {
        heroId,
        state,
      },
    };
    io.to(placeId).emit(socketEvents.placeUpdate(), socketData);
  },
  sendMapAddHero(heroId: string, mapId: string) {
    const socket = this.getSocket(heroId);

    const hero = heroService.getHero(heroId);
    const data: MapUpdateData = {
      type: 'ADD_HERO',
      payload: {
        mapId,
        hero: {
          id: hero.id,
          name: hero.name,
          avatarImage: hero.avatarImage,
          characterImage: hero.characterImage,
          level: hero.level,
          state: hero.state,
          x: hero.location.x,
          y: hero.location.y,
        },
      },
    };
    socket.join(mapId);
    io.to(mapId).emit(socketEvents.mapUpdate(), data);
  },
  sendMapRemoveHero(heroId: string, mapId: string) {
    const socket = this.getSocket(heroId);

    const hero = heroService.getHero(heroId);
    const data: MapUpdateData = {
      type: 'REMOVE_HERO',
      payload: {
        heroId: hero.id,
      },
    };
    socket.leave(mapId);
    io.to(mapId).emit(socketEvents.mapUpdate(), data);
  },
  sendPlaceRemoveHero(heroId: string, placeId: string) {
    const socket = this.getSocket(heroId);

    const hero = heroService.getHero(heroId);
    const data: PlaceUpdateData = {
      type: 'REMOVE_HERO',
      payload: {
        heroId: hero.id,
      },
    };
    socket.leave(placeId);
    io.to(placeId).emit(socketEvents.placeUpdate(), data);
  },
  sendPlaceAddHero(heroId: string, placeId: string) {
    const socket = this.getSocket(heroId);
    const hero = heroService.getHero(heroId);
    const data: PlaceUpdateData = {
      type: 'ADD_HERO',
      payload: {
        hero: {
          id: hero.id,
          avatarImage: hero.avatarImage,
          level: hero.level,
          name: hero.name,
          state: hero.state,
        },
        placeId,
      },
    };
    socket.join(placeId);
    io.to(placeId).emit(socketEvents.placeUpdate(), data);
  },
  sendToClientSysMessage(heroId: string, msgData: GameSysMessage) {
    io.to(heroId).emit(socketEvents.selfMessage(), msgData);
  },
  sendToClientExpResult({ expResult, heroId, onlyLevelUp = false }: SendToClientExpResult) {
    if (!onlyLevelUp || expResult.isLevelUp) {
      const skill = skillService.getSkillByInstanceId(heroId, expResult.skillInstanceId);
      const socketData: SkillUpData = {
        type: 'SKILL_UP',
        payload: { skill, message: expResult.message, expAmount: expResult.amount },
      };
      io.to(heroId).emit(socketEvents.selfData(), socketData);
    }
  },
};

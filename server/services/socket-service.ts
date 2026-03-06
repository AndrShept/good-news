import type {
  HeroUpdateStateEvent,
  MapChunkDespawnEntityData,
  MapChunkSpawnEntityData,
  PlaceUpdateEvent,
  SkillUpEvent,
  WalkMapFinishEvent,
  WalkMapUpdateEvent,
} from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { GameSysMessage, MapChunkEntitiesData, MapChunkEntitiesType, StateType } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { serverState } from '../game/state/server-state';
import { heroService } from './hero-service';
import { mapService } from './map-service';
import { skillService } from './skill-service';

interface SendToClientExpResult {
  heroId: string;
  expResult: ReturnType<typeof skillService.addExp>;
  onlyLevelUp?: boolean;
}

type SendMapChunkSpawnEntities = {
  chunkId: string;
  type: MapChunkEntitiesType;
  entityId: string;
};
type SendMapChunkDespawnEntities = {
  chunkId: string;
  type: MapChunkEntitiesType;
  entityId: string;
};

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
    const socketData: HeroUpdateStateEvent = {
      type: 'UPDATE_STATE',
      payload: {
        heroId,
        state,
      },
    };
    io.to(placeId).emit(socketEvents.placeUpdate(), socketData);
  },
  sendMapMoveHero(heroId: string) {
    const hero = heroService.getHero(heroId);
    const heroesAroundRadius = mapService.getNearHeroes(heroId);
    for (const aroundHero of heroesAroundRadius) {
      const socketData: WalkMapUpdateEvent = {
        type: 'WALK_MAP_UPDATE',
        payload: { heroId, x: hero.location.x, y: hero.location.y },
      };
      io.to(aroundHero.id).emit(socketEvents.walkMap(), socketData);
    }
  },
  sendMapChunkMoveFinish(heroId: string) {
    const heroesAroundRadius = mapService.getNearHeroes(heroId);
    for (const aroundHero of heroesAroundRadius) {
      const socketData: WalkMapFinishEvent = {
        type: 'WALK_MAP_FINISH',
        payload: { heroId: heroId, state: 'IDLE' },
      };
      io.to(aroundHero.id).emit(socketEvents.walkMap(), socketData);
    }
  },
  sendMapChunkSpawnEntities({ chunkId, type, entityId }: SendMapChunkSpawnEntities) {
    let data: MapChunkEntitiesData | undefined = undefined;
    switch (type) {
      case 'HERO':
        const socket = socketService.getSocket(entityId);
        socket.join(chunkId);
        data = { type, payload: heroService.getHeroMapData(entityId) };
        break;
      case 'CREATURE': {
        const payload = serverState.creature.get(entityId);
        if (!payload) break;
        data = { type, payload };
        break;
      }

      case 'CORPSE':
        const payload = serverState.corpse.get(entityId);
        if (!payload) break;
        data = { type, payload };
        break;
    }
    if (!data) return;

    io.to(chunkId).emit(socketEvents.entitySpawn(), data);
  },
  sendMapChunkDespawnEntities({ chunkId, type, entityId }: SendMapChunkDespawnEntities) {
    const data: MapChunkDespawnEntityData = {
      type,
      payload: { entityId },
    };

    io.to(chunkId).emit(socketEvents.entityDespawn(), data);
  },
  sendPlaceRemoveHero(heroId: string, placeId: string) {
    const socket = this.getSocket(heroId);

    const hero = heroService.getHero(heroId);
    const data: PlaceUpdateEvent = {
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
    const data: PlaceUpdateEvent = {
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
      const socketData: SkillUpEvent = {
        type: 'SKILL_UP',
        payload: { skill, message: expResult.message, expAmount: expResult.amount },
      };
      io.to(heroId).emit(socketEvents.selfData(), socketData);
    }
  },
};

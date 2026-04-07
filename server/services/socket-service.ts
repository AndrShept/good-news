import type {
  HeroUpdateEvent,
  MapChunkDespawnEntityData,
  MapChunkSpawnEntityData,
  MapChunkUpdateEntitiesData,
  PlaceUpdateEvent,
  SkillExpUpEvent,
  UpdateItemDeltaEvent,
} from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type {
  GameSysMessage,
  ItemsInstanceDeltaEvent,
  MapChunkEntitiesData,
  MapChunkEntitiesType,
  OmitDeepHero,
  StateType,
} from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { serverState } from '../game/state/server-state';
import { heroService } from './hero-service';
import { mapService } from './map-service';
import { skillService } from './skill-service';

interface SendToClientExpResult {
  heroId: string;
  data: { expResult: ReturnType<typeof skillService.addExp>; isShowMessageOnlyLvlUp: boolean }[];
}

type SendMapChunkSpawnEntities = {
  chunkId: string;
  type: MapChunkEntitiesType;
  entityIds: string[];
};
type SendMapChunkDespawnEntities = {
  chunkId: string;
  type: MapChunkEntitiesType;
  entityIds: string[];
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
    const socketData: HeroUpdateEvent = {
      type: 'UPDATE_HERO',
      heroId,
      payload: {
        state,
      },
    };
    io.to(placeId).emit(socketEvents.placeUpdate(), socketData);
  },
  sendMapMoveHero(heroId: string, chunkId: string) {
    const hero = heroService.getHero(heroId);

    const socketData: MapChunkUpdateEntitiesData = {
      entityId: heroId,
      data: { type: 'HERO', payload: { x: hero.location.x, y: hero.location.y } },
    };

    io.to(chunkId).emit(socketEvents.entityUpdate(), socketData);
  },
  sendMapChunkMoveFinish(heroId: string, chunkId: string) {
    const hero = heroService.getHero(heroId);

    const socketData: MapChunkUpdateEntitiesData = {
      entityId: heroId,
      isFinishMove: true,
      data: { type: 'HERO', payload: { state: 'IDLE' } },
    };

    io.to(chunkId).emit(socketEvents.entityUpdate(), socketData);
  },
  sendMapChunkSpawnEntities({ chunkId, type, entityIds }: SendMapChunkSpawnEntities) {
    let data: MapChunkEntitiesData | undefined = undefined;
    switch (type) {
      case 'HERO':
        data = { type, payload: entityIds.map((i) => heroService.getHeroMapData(i)) };
        break;
      case 'CREATURE': {
        const payload = entityIds.map((i) => serverState.creature.get(i)).filter((i) => !!i);
        if (!payload) break;
        data = { type, payload };
        break;
      }

      case 'CORPSE':
        const payload = entityIds.map((i) => serverState.corpse.get(i)).filter((i) => !!i);
        if (!payload) break;
        data = { type, payload };
        break;
    }
    if (!data) return;

    io.to(chunkId).emit(socketEvents.entitySpawn(), data);
  },
  sendMapChunkDespawnEntities({ chunkId, type, entityIds }: SendMapChunkDespawnEntities) {
    const data: MapChunkDespawnEntityData = {
      type,
      payload: { entityIds },
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
  sendToClientExpResult({ heroId, data }: SendToClientExpResult) {
    const socketData: SkillExpUpEvent = {
      type: 'SKILL_EXP_UP',
      heroId,
      payload: data,
    };
    io.to(heroId).emit(socketEvents.selfData(), socketData);
  },
  sendToClientUpdateSelfHeroData(heroId: string, data: OmitDeepHero) {
    const socketData: HeroUpdateEvent = {
      type: 'UPDATE_HERO',
      heroId,
      payload: data,
    };
    io.to(heroId).emit(socketEvents.selfData(), socketData);
  },
  sendToClientItemsDelta(heroId: string, itemsDelta: ItemsInstanceDeltaEvent[]) {
    const socketData: UpdateItemDeltaEvent = {
      type: 'ITEM_DELTA',
      payload: { itemsDelta },
    };
    io.to(heroId).emit(socketEvents.selfData(), socketData);
  },
};

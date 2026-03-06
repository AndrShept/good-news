import { MAP_CHUNK_SIZE } from '@/shared/constants';
import type { Corpse, Creature, MapChunkEntitiesData, MapChunkEntitiesType } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { type HeroRuntime, serverState } from '../game/state/server-state';
import { heroService } from './hero-service';
import { socketService } from './socket-service';

interface GetChunkId {
  x: number;
  y: number;
  mapId: string;
}

interface SpawnMapEntitiesInChunk {
  x: number;
  y: number;
  mapId: string;
  type: MapChunkEntitiesType;
  entityId: string;
}
interface DespawnMapEntitiesInChunk {
  x: number;
  y: number;
  mapId: string;
  type: MapChunkEntitiesType;
  entityId: string;
}

export const mapService = {
  getNearHeroes(heroId: string) {
    const hero = heroService.getHero(heroId);

    const radius = 5;

    const heroes = Array.from(serverState.hero.values()).filter((h) => {
      const dx = h.location.x - hero.location.x;
      const dy = h.location.y - hero.location.y;
      return dx * dx + dy * dy <= radius * radius && h.location.mapId === hero.location.mapId;
    });
    return heroes;
  },

  getChunkId({ mapId, x, y }: GetChunkId) {
    const dx = Math.floor(x / MAP_CHUNK_SIZE);
    const dy = Math.floor(y / MAP_CHUNK_SIZE);
    return `${mapId}:${dy}:${dx}`;
  },
  spawnMapEntitiesInChunk({ x, y, mapId, entityId, type }: SpawnMapEntitiesInChunk) {
    const chunkId = this.getChunkId({
      mapId,
      x,
      y,
    });
    const chunk = serverState.mapChunks.get(chunkId);
    if (!chunk) {
      serverState.mapChunks.set(chunkId, { corpses: new Set(), creatures: new Set(), heroes: new Set() });
    }

    switch (type) {
      case 'HERO':
        chunk?.heroes.add(entityId);
        break;
      case 'CREATURE':
        chunk?.creatures.add(entityId);
        break;
      case 'CORPSE':
        chunk?.corpses.add(entityId);
        break;
    }

    socketService.sendMapChunkSpawnEntities({ chunkId, entityId, type });
  },
  despawnMapEntitiesInChunk({ x, y, mapId, entityId, type }: DespawnMapEntitiesInChunk) {
    const chunkId = this.getChunkId({
      mapId,
      x,
      y,
    });
    const chunk = serverState.mapChunks.get(chunkId);
    if (!chunk) {
      throw new HTTPException(400, { message: 'chunk not found' });
    }

    switch (type) {
      case 'HERO':
        chunk?.heroes.delete(entityId);

        break;
      case 'CREATURE':
        chunk?.creatures.delete(entityId);
        serverState.creature.delete(entityId);
        break;
      case 'CORPSE':
        chunk?.corpses.delete(entityId);
        serverState.corpse.delete(entityId);
        break;
    }

    socketService.sendMapChunkDespawnEntities({ chunkId, entityId, type });
  },
};

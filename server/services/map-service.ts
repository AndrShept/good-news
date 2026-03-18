import { MAP_CHUNK_SIZE } from '@/shared/constants';
import type { Corpse, Creature, MapChunkEntitiesData, MapChunkEntitiesType, MapHero } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { type HeroRuntime, serverState } from '../game/state/server-state';
import { heroService } from './hero-service';
import { socketService } from './socket-service';
import { spawnService } from './spawn-service';
import { creatureTemplateById } from '@/shared/templates/creature-template';

interface GetChunkId {
  x: number;
  y: number;
  mapId: string;
}

interface GetChunkIds {
  x: number;
  y: number;
  mapId: string;
}

interface SpawnMapEntitiesInChunk {
  type: MapChunkEntitiesType;
  entityId: string;
  x: number;
  y: number;
  mapId: string;
}
interface DespawnMapEntitiesInChunk {
  x: number;
  y: number;
  mapId: string;
  type: MapChunkEntitiesType;
  entityId: string;
}

interface SliceChunksLayerData {
  startY: number;
  startX: number;
  sliceHeight: number;
  sliceWidth: number;
  width: number;
  data: number[];
}

export const mapService = {
  // getNearHeroes(heroId: string) {
  //   const hero = heroService.getHero(heroId);

  //   const radius = 5;

  //   const heroes = Array.from(serverState.hero.values()).filter((h) => {
  //     const dx = h.location.x - hero.location.x;
  //     const dy = h.location.y - hero.location.y;
  //     return dx * dx + dy * dy <= radius * radius && h.location.mapId === hero.location.mapId;
  //   });
  //   return heroes;
  // },

  getChunkId({ mapId, x, y }: GetChunkId) {
    const dx = Math.floor(x / MAP_CHUNK_SIZE);
    const dy = Math.floor(y / MAP_CHUNK_SIZE);
    return `${mapId}:${dy}:${dx}`;
  },
  spawnMapEntitiesInChunk({ entityId, type, x, y, mapId }: SpawnMapEntitiesInChunk) {
    const chunkId = mapService.getChunkId({ mapId, x, y });
    let chunk = serverState.mapChunks.get(chunkId);
    if (!chunk) {
      chunk = { corpses: new Set(), creatures: new Set(), heroes: new Set() };
      serverState.mapChunks.set(chunkId, chunk);
  
    }

    switch (type) {
      case 'HERO':
        chunk.heroes.add(entityId);

        break;
      case 'CREATURE':
    
        chunk.creatures.add(entityId);
   
        break;
      case 'CORPSE':
        chunk.corpses.add(entityId);
        break;
    }
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

    socketService.sendMapChunkDespawnEntities({ chunkId, entityIds: [entityId], type });
  },
  getAroundChunkIds({ mapId, x, y }: GetChunkIds) {
    const chunkX = Math.floor(x / MAP_CHUNK_SIZE);
    const chunkY = Math.floor(y / MAP_CHUNK_SIZE);

    const chunkIds: string[] = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        chunkIds.push(`${mapId}:${chunkY + dy}:${chunkX + dx}`);
      }
    }

    return chunkIds;
  },

  getMapEntitiesByChunkIds(chunkIds: string[]) {
    const entity = {
      corpses: [] as Corpse[],
      creatures: [] as Creature[],
      heroes: [] as MapHero[],
    };
    for (const chunkId of chunkIds) {
      const chunk = serverState.mapChunks.get(chunkId);
      const heroes = [...(chunk?.heroes ?? [])].map((id) => heroService.getHeroMapData(id));
      const creatures = [...(chunk?.creatures ?? [])].map((id) => serverState.creature.get(id)).filter((i) => !!i);
      const corpses = [...(chunk?.corpses ?? [])].map((id) => serverState.corpse.get(id)).filter((i) => !!i);

      entity.corpses.push(...corpses);
      entity.creatures.push(...creatures);
      entity.heroes.push(...heroes);
    }

    return entity;
  },

  sliceChunksLayerData({ data, sliceHeight, sliceWidth, startX, startY, width }: SliceChunksLayerData) {
    const result: number[] = [];

    for (let y = 0; y < sliceHeight; y++) {
      const rowStart = (startY + y) * width + startX;
      const rowEnd = rowStart + sliceWidth;

      result.push(...data.slice(rowStart, rowEnd));
    }

    return result;
  },
};

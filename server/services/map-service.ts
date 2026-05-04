import { mapTemplate } from '@/shared/templates/map-template';
import {
  type Corpse,
  type MapChunkEntitiesData,
  type MapChunkEntitiesType,
  type MapCorpse,
  type MapCreature,
  type MapHero,
  type SpawnCreatureTileType,
  type TileType,
  spawnCreatureTileTypeValues,
} from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { type HeroRuntime, type SpawnZonesInfo, serverState } from '../game/state/server-state';
import { MAP_CHUNK_SIZE } from '../lib/config/server-constants';
import { corpseService } from './corpse-service';
import { creatureService } from './creature-service';
import { heroService } from './hero-service';
import { socketService } from './socket-service';
import { spawnService } from './spawn-service';

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
interface SpawnHeroInMap {
  heroId: string;
  mapId: string;
  x: number;
  y: number;
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
  getMap(mapId: string) {
    const map = mapTemplate.find((m) => m.id === mapId);
    if (!map) throw new HTTPException(400, { message: 'map not found' });
    return map;
  },
  getChunkId({ mapId, x, y }: GetChunkId) {
    const dx = Math.floor(x / MAP_CHUNK_SIZE);
    const dy = Math.floor(y / MAP_CHUNK_SIZE);
    return `${mapId}:${dy}:${dx}`;
  },
  spawnHeroInMap({ heroId, mapId, x, y }: SpawnHeroInMap) {
    const socket = socketService.getSocket(heroId);
    const chunkId = this.getChunkId({
      x,
      y,
      mapId,
    });
    const chunksIds = this.getAroundChunkIds({ x, y, mapId });
    for (const chunkId of chunksIds) {
      socket.join(chunkId);

    }

    this.spawnMapEntitiesInChunk({
      type: 'HERO',
      entityId: heroId,
      x,
      y,
      mapId,
    });

    socketService.sendMapChunkSpawnEntities({ chunkId, entityIds: [heroId], type: 'HERO' });
  },
  initChunk(chunkId: string) {
    const spawnZones: Record<SpawnCreatureTileType, SpawnZonesInfo> = {
      CAVE: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      ROCKY_FIELD: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      MOUNTAIN: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      FOREST: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      DENSE_FOREST: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      ANCIENT_FOREST: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      LAKE: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      MEADOW: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      PLAINS: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      SWAMP: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
      FARM: {
        indexes: [],
        creatureAlive: 0,
        lastSpawnAt: 0,
      },
    };
    for (const spawnTileType of spawnCreatureTileTypeValues) {
      ((spawnZones[spawnTileType].creatureAlive = 0), (spawnZones[spawnTileType].lastSpawnAt = 0));

      spawnZones[spawnTileType].indexes = mapService.getChunkTilesByLayer(chunkId, spawnTileType);
    }
    const chunk = { corpses: new Set<string>(), creatures: new Set<string>(), heroes: new Set<string>(), spawnZones };

    serverState.mapChunks.set(chunkId, chunk);
    console.log('CHUNK_INIT:',chunkId)
    return chunk;
  },
  spawnMapEntitiesInChunk({ entityId, type, x, y, mapId }: SpawnMapEntitiesInChunk) {
    const chunkId = this.getChunkId({ mapId, x, y });
    let chunk = serverState.mapChunks.get(chunkId);
    if (!chunk) {
      chunk = this.initChunk(chunkId);
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
      corpses: [] as MapCorpse[],
      creatures: [] as MapCreature[],
      heroes: [] as MapHero[],
    };
    for (const chunkId of chunkIds) {
      const chunk = serverState.mapChunks.get(chunkId);
      const heroes = [...(chunk?.heroes ?? [])].map((id) => heroService.getHeroMapData(id));
      const creatures = [...(chunk?.creatures ?? [])].map((id) => creatureService.getCreatureMapData(id));
      const corpses = [...(chunk?.corpses ?? [])].map((id) => corpseService.getCorpseMapData(id));

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

  parseChunkId(chunkId: string) {
    const [mapId, chunkY, chunkX] = chunkId.split(':');
    return { mapId, chunkX: Number(chunkX), chunkY: Number(chunkY) };
  },
  sliceChunksLayerDataIndexes({ data, sliceHeight, sliceWidth, startX, startY, width }: SliceChunksLayerData) {
    const result: number[] = [];

    for (let y = 0; y < sliceHeight; y++) {
      for (let x = 0; x < sliceWidth; x++) {
        const globalIndex = (startY + y) * width + (startX + x);
        if (data[globalIndex] !== 0) {
          result.push(globalIndex);
        }
      }
    }

    return result;
  },
  getChunkTilesByLayer(chunkId: string, layerName: TileType): number[] {
    const { mapId, chunkX, chunkY } = this.parseChunkId(chunkId);
    const map = mapTemplate.find((m) => m.id === mapId);
    if (!map) return [];

    const layer = map.layers.find((l) => l.name === layerName);
    if (!layer || !layer.data) return [];

    return this.sliceChunksLayerDataIndexes({
      data: layer.data,
      width: map.width,
      startX: chunkX * MAP_CHUNK_SIZE,
      startY: chunkY * MAP_CHUNK_SIZE,
      sliceWidth: MAP_CHUNK_SIZE,
      sliceHeight: MAP_CHUNK_SIZE,
    });
  },
};

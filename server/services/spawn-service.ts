import { type CreatureKey, creatureTemplateByKey } from '@/shared/templates/creature-template';
import { mapTemplate } from '@/shared/templates/map-template';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { SPAWN_CREATURE_TABLE } from '../lib/table/spawn-creature-table';
import { generateRandomUuid, getTileExists } from '../lib/utils';
import { mapService } from './map-service';

export const spawnService = {
  getSpawnPoint(spawnId: string) {
    const spawnPoint = serverState.spawnPoints.get(spawnId);
    if (!spawnPoint) {
      throw new HTTPException(400, { cause: 'spawn point not found' });
    }
    return spawnPoint;
  },
  getSpawnPosition(spawnId: string) {
    const spawn = this.getSpawnPoint(spawnId);
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * spawn.radius;
    const x = Math.floor(spawn.x + Math.cos(angle) * r);
    const y = Math.floor(spawn.y + Math.sin(angle) * r);
    const map = mapTemplate.find((m) => m.id === spawn.mapId);
    if (!map) return;
    const index = y * map.width + x;
    const collisionTile = getTileExists(spawn.mapId, index, 'COLLISION');

    if (collisionTile) {
      this.getSpawnPosition(spawnId);
    } else {
      return {
        x,
        y,
      };
    }
  },
  createSpawnPoints() {
    const maps = mapTemplate;
    for (const map of maps) {
      const spawnLayer = map.layers.find((l) => l.name === 'SPAWN');
      if (!spawnLayer || !spawnLayer.objects) continue;
      for (const spawnObject of spawnLayer.objects) {
        const keyObj = spawnObject.properties.find((p) => p.name === 'key');
        if (!keyObj) continue;
        const id = generateRandomUuid();
        const creatureKey = keyObj.value as CreatureKey;
        const x = spawnObject.x / spawnObject.width;
        const y = spawnObject.y / spawnObject.width;
        const chunkId = mapService.getChunkId({ x, y, mapId: map.id });

        let chunkSpawns = serverState.chunkSpawns.get(chunkId);

        if (!chunkSpawns) {
          chunkSpawns = new Set();
          serverState.chunkSpawns.set(chunkId, chunkSpawns);
        }
        chunkSpawns.add(id);
        serverState.spawnPoints.set(id, {
          id,
          name: spawnObject.name,
          x,
          y,
          mapId: map.id,
          chunkId,
          creatureTemplateId: creatureTemplateByKey[creatureKey].id,
          radius: SPAWN_CREATURE_TABLE[creatureKey].radius,
          maxCreatures: SPAWN_CREATURE_TABLE[creatureKey].maxCreatures,
          respawnTime: SPAWN_CREATURE_TABLE[creatureKey].respawnTime,
          alive: 0,
          respawnAt: null,
        });
      }
    }
  },
};

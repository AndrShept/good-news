import { creatureTemplateByKey } from '@/shared/templates/creature-template';
import type { SpawnCreatureTileType } from '@/shared/types';

import { SPAWN_ZONE_CREATURE_TABLE } from '../lib/table/spawn-zone-creature-table';
import { creatureService } from '../services/creature-service';
import { heroService } from '../services/hero-service';
import { mapService } from '../services/map-service';
import { socketService } from '../services/socket-service';
import { spawnService } from '../services/spawn-service';
import { serverState } from './state/server-state';

// export const spawnCreatureOnSpawnPointTick = (now: number) => {
//   const activeChunks = new Set<string>();
//   for (const { heroes } of serverState.mapChunks.values()) {
//     for (const heroId of heroes) {
//       const hero = heroService.getHero(heroId);
//       const { mapId, x, y } = hero.location;
//       const chunkAroundHero = mapService.getAroundChunkIds({ mapId: mapId!, x, y });
//       chunkAroundHero.forEach((c) => activeChunks.add(c));
//     }
//   }

//   for (const chunkId of activeChunks) {
//     const chunkSpawns = serverState.chunkSpawns.get(chunkId);
//     if (!chunkSpawns) continue;
//     const creatures = [];
//     for (const spawnId of chunkSpawns.keys()) {
//       const spawn = spawnService.getSpawnPoint(spawnId);
//       if (spawn.alive < spawn.maxCreatures) {
//         const spawnCount = spawn.maxCreatures - spawn.alive;
//         for (let i = 0; i < spawnCount; i++) {
//           const pos = spawnService.getSpawnPosition(spawn.id);
//           if (!pos) continue;
//           const newCreature = creatureService.createCreature({
//             creatureTemplateId: spawn.creatureTemplateId,
//             mapId: spawn.mapId,
//             x: pos.x,
//             y: pos.y,
//           });
//           creatures.push(newCreature);
//           mapService.spawnMapEntitiesInChunk({
//             entityId: newCreature.id,
//             mapId: newCreature.mapId,
//             type: 'CREATURE',
//             x: newCreature.x,
//             y: newCreature.y,
//           });
//           serverState.creature.set(newCreature.id, newCreature);
//         }

//         spawn.alive += Math.min(spawn.maxCreatures, spawnCount);
//       }
//     }
//     if (creatures.length) {
//       console.log(`SPAWN ${creatures.length} mobs - chunkId: ${chunkId}`);
//       socketService.sendMapChunkSpawnEntities({ chunkId, type: 'CREATURE', entityIds: creatures.map((c) => c.id) });
//     }
//   }
// };

export const spawnCreatureTick = (now: number) => {
  const activeChunks = new Set<string>();
  for (const { heroes } of serverState.mapChunks.values()) {
    for (const heroId of heroes) {
      const hero = heroService.getHero(heroId);
      const { mapId, x, y } = hero.location;
      if (!mapId) continue;
      const chunkAroundHero = mapService.getAroundChunkIds({ mapId, x, y });
      chunkAroundHero.forEach((c) => activeChunks.add(c));
    }
  }

  for (const chunkId of activeChunks) {
    let chunk = serverState.mapChunks.get(chunkId);
    if (!chunk) {
      chunk = mapService.initChunk(chunkId);
    }
    const { mapId } = mapService.parseChunkId(chunkId);
    const creaturesIds: string[] = [];

    const map = mapService.getMap(mapId);
    for (const [spawnTileZone, zoneData] of Object.entries(chunk.spawnZones)) {
      if (!zoneData.indexes) continue;
      const maxSpawnQuantity = Math.floor(
        zoneData.indexes.length / SPAWN_ZONE_CREATURE_TABLE[spawnTileZone as SpawnCreatureTileType].density,
      );
      for (let i = zoneData.creatureAlive; i < maxSpawnQuantity; i++) {
        const random = Math.floor(Math.random() * SPAWN_ZONE_CREATURE_TABLE[spawnTileZone as SpawnCreatureTileType].creatures.length);

        const template = creatureTemplateByKey[SPAWN_ZONE_CREATURE_TABLE[spawnTileZone as SpawnCreatureTileType].creatures[random]];
        const randomIndex = zoneData.indexes[Math.floor(Math.random() * zoneData.indexes.length)];
        const x = randomIndex % map.width;
        const y = Math.floor(randomIndex / map.width);
        console.log('CREATE MOB', ` ${template.name} x:${x} , y:${y}`);
        const newCreature = creatureService.createCreature({
          creatureTemplateId: template.id,
          mapId,
          x,
          y,
        });
        creaturesIds.push(newCreature.id);
        mapService.spawnMapEntitiesInChunk({
          entityId: newCreature.id,
          mapId: newCreature.mapId,
          type: 'CREATURE',
          x: newCreature.x,
          y: newCreature.y,
        });
        serverState.creature.set(newCreature.id, newCreature);
        zoneData.creatureAlive++;
      }
    }
    socketService.sendMapChunkSpawnEntities({ chunkId, type: 'CREATURE', entityIds: creaturesIds });
    // const forestTileIndexes = mapService.getChunkTilesByLayer(chunkId, 'FOREST');
    // console.log(chunk.spawnZones.FARM);
    // for (const creatureId of chunk.creatures.keys()) {
    //   const creature = creatureService.getCreature(creatureId);
    //   const creatureIndex = creature.y * map.width + creature.x;
    // }

    // const creatures = [];
    // for (const spawnId of chunkSpawns.keys()) {
    //   const spawn = spawnService.getSpawnPoint(spawnId);
    //   if (spawn.alive < spawn.maxCreatures) {
    //     const spawnCount = spawn.maxCreatures - spawn.alive;
    //     for (let i = 0; i < spawnCount; i++) {
    //       const pos = spawnService.getSpawnPosition(spawn.id);
    //       if (!pos) continue;
    //       const newCreature = creatureService.createCreature({
    //         creatureTemplateId: spawn.creatureTemplateId,
    //         mapId: spawn.mapId,
    //         x: pos.x,
    //         y: pos.y,
    //       });
    //       creatures.push(newCreature);
    //       mapService.spawnMapEntitiesInChunk({
    //         entityId: newCreature.id,
    //         mapId: newCreature.mapId,
    //         type: 'CREATURE',
    //         x: newCreature.x,
    //         y: newCreature.y,
    //       });
    //       serverState.creature.set(newCreature.id, newCreature);
    //     }

    //     spawn.alive += Math.min(spawn.maxCreatures, spawnCount);
    //   }
    // }
    // if (creatures.length) {
    //   console.log(`SPAWN ${creatures.length} mobs - chunkId: ${chunkId}`);
    //   socketService.sendMapChunkSpawnEntities({ chunkId, type: 'CREATURE', entityIds: creatures.map((c) => c.id) });
    // }
  }
};

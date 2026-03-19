import { creatureService } from '../services/creature-service';
import { heroService } from '../services/hero-service';
import { mapService } from '../services/map-service';
import { socketService } from '../services/socket-service';
import { spawnService } from '../services/spawn-service';
import { serverState } from './state/server-state';

export const spawnCreatureTick = (now: number) => {
  const activeChunks = new Set<string>();
  for (const { heroes } of serverState.mapChunks.values()) {
    for (const heroId of heroes) {
      const hero = heroService.getHero(heroId);
      const { mapId, x, y } = hero.location;
      const chunkAroundHero = mapService.getAroundChunkIds({ mapId: mapId!, x, y });
      chunkAroundHero.forEach((c) => activeChunks.add(c));
    }
  }

  for (const chunkId of activeChunks) {
    const chunkSpawns = serverState.chunkSpawns.get(chunkId);
    if (!chunkSpawns) continue;
    const creatures = [];
    for (const spawnId of chunkSpawns.keys()) {
      const spawn = spawnService.getSpawnPoint(spawnId);
      if (spawn.alive < spawn.maxCreatures) {
        const spawnCount = spawn.maxCreatures - spawn.alive;
        for (let i = 0; i < spawnCount; i++) {
          const pos = spawnService.getSpawnPosition(spawn.id);
          if (!pos) continue;
          const newCreature = creatureService.createCreature({
            creatureTemplateId: spawn.creatureTemplateId,
            mapId: spawn.mapId,
            x: pos.x,
            y: pos.y,
          });
          creatures.push(newCreature);
          mapService.spawnMapEntitiesInChunk({
            entityId: newCreature.id,
            mapId: newCreature.mapId,
            type: 'CREATURE',
            x: newCreature.x,
            y: newCreature.y,
          });
          serverState.creature.set(newCreature.id, newCreature);
        }

        spawn.alive += Math.min(spawn.maxCreatures, spawnCount);
      }
    }
    if (creatures.length) {
      console.log(`SPAWN ${creatures.length} mobs - chunkId: ${chunkId}`);
      socketService.sendMapChunkSpawnEntities({ chunkId, type: 'CREATURE', entityIds: creatures.map((c) => c.id) });
    }
  }
};

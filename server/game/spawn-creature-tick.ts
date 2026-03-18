import { creatureService } from '../services/creature-service';
import { heroService } from '../services/hero-service';
import { mapService } from '../services/map-service';
import { socketService } from '../services/socket-service';
import { spawnService } from '../services/spawn-service';
import { serverState } from './state/server-state';

export const spawnCreatureTick = (now: number) => {
  for (const { heroes } of serverState.mapChunks.values()) {
    // console.log('hero', heroes);
    for (const heroId of heroes) {
      const hero = heroService.getHero(heroId);
      const chunkId = hero.location.chunkId;
      if (!chunkId) continue;
      const chunkSpawns = serverState.chunkSpawns.get(chunkId);
      if (!chunkSpawns) continue;
      const creatures = [];
      for (const spawnId of chunkSpawns.keys()) {
        //   console.log(spawnId);
        const spawn = spawnService.getSpawnPoint(spawnId);
        if (spawn.alive < spawn.maxCreatures) {
          for (let i = 0; i < spawn.maxCreatures - spawn.alive; i++) {
            const pos = spawnService.getSpawnPosition(spawn.id);
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

          spawn.alive = spawn.maxCreatures;
        }
      }
      console.log(creatures);
      if (creatures.length) {
        socketService.sendMapChunkSpawnEntities({ chunkId, type: 'CREATURE', entityIds: creatures.map((c) => c.id) });
      }
    }
  }
};

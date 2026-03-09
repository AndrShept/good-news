import type { PathNode } from '@/shared/types';
import { or } from 'drizzle-orm';

import { heroOffline } from '../lib/heroOffline';
import { mapService } from '../services/map-service';
import { socketService } from '../services/socket-service';
import { serverState } from './state/server-state';

export const moveTick = (now: number) => {
  for (const [heroId, { paths, offlineTimer, userId }] of serverState.hero.entries()) {
    const hero = serverState.hero.get(heroId);
    if (!hero) continue;
    if (offlineTimer && offlineTimer <= now) {
      heroOffline(heroId, userId);
      console.log(' heroOffline', hero.isOnline);
    }

    if (!paths?.length) continue;
    const nextPath = paths[0];
    let lastStep: PathNode | null = null;
    if (nextPath.completedAt <= now) {
      const step = paths.shift();
      if (!step) continue;
      if (!hero.location.mapId) continue;
      lastStep = step;

      const chunkId = mapService.getChunkId({ mapId: hero.location.mapId, x: step.x, y: step.y });

      if (chunkId !== hero.location.chunkId) {
        const socket = socketService.getSocket(heroId);
        hero.location.chunkId = chunkId;
        const oldChunks = mapService.getAroundChunkIds({ x: hero.location.x, y: hero.location.y, mapId: hero.location.mapId });
        const newChunks = mapService.getAroundChunkIds({ x: step.x, y: step.y, mapId: hero.location.mapId });
        const diffOld = oldChunks.filter((c) => !newChunks.includes(c));
        const diffNew = newChunks.filter((c) => !oldChunks.includes(c));
        console.log('oldChunks', oldChunks);
        console.log('newChunks', newChunks);
        console.log('diffOld', diffOld);
        console.log('diffNew', diffNew);
        for (const old of diffOld) {
          socket.leave(old);
        }
        for (const dNew of diffNew) {
          socket.join(dNew);
        }
        mapService.despawnMapEntitiesInChunk({
          entityId: heroId,
          mapId: hero.location.mapId,
          type: 'HERO',
          x: hero.location.x,
          y: hero.location.y,
        });
        mapService.spawnMapEntitiesInChunk({ entityId: heroId, type: 'HERO', x: step.x, y: step.y, mapId: hero.location.mapId });
        socketService.sendMapChunkSpawnEntities({ chunkId, entityId: heroId, type: 'HERO' });
      }
      hero.location.x = step.x;
      hero.location.y = step.y;
      socketService.sendMapMoveHero(heroId, chunkId);
    }

    if (!paths.length && lastStep) {
      // serverState.pathPersistQueue.set(heroId, {
      //   x: lastStep.x,
      //   y: lastStep.y,
      // });

      hero.state = 'IDLE';

      socketService.sendMapChunkMoveFinish(heroId, hero.location.chunkId!);
    }
  }
};

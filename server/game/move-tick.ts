
import type { PathNode } from '@/shared/types';

import { heroOffline } from '../lib/heroOffline';
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
      lastStep = step;

      hero.location.x = step.x;
      hero.location.y = step.y;
      socketService.sendMapMoveHero(heroId, hero.location.chunkId! );
    }

    if (!paths.length && lastStep) {
      serverState.pathPersistQueue.set(heroId, {
        x: lastStep.x,
        y: lastStep.y,
      });
      // const hero = serverState.hero.get(heroId);
     
        hero.state = 'IDLE';
     
      socketService.sendMapChunkMoveFinish(heroId,hero.location.chunkId!);
    }
  }
};

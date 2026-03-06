
import type { PathNode } from '@/shared/types';

import { heroOffline } from '../lib/heroOffline';
import { socketService } from '../services/socket-service';
import { serverState } from './state/server-state';

export const moveTick = (now: number) => {
  for (const [heroId, { paths, offlineTimer, userId }] of serverState.hero.entries()) {
    const heroState = serverState.hero.get(heroId);
    if (!heroState) continue;
    if (offlineTimer && offlineTimer <= now) {
      heroOffline(heroId, userId);
      console.log(' heroOffline', heroState.isOnline);
    }
    if (!paths?.length) continue;
    const nextPath = paths[0];
    let lastStep: PathNode | null = null;
    if (nextPath.completedAt <= now) {
      const step = paths.shift();
      if (!step) continue;
      lastStep = step;

      heroState.location.x = step.x;
      heroState.location.y = step.y;
      socketService.sendMapMoveHero(heroId);
    }

    if (!paths.length && lastStep) {
      serverState.pathPersistQueue.set(heroId, {
        x: lastStep.x,
        y: lastStep.y,
      });
      const heroState = serverState.hero.get(heroId);
      if (heroState) {
        heroState.state = 'IDLE';
      }
      socketService.sendMapChunkMoveFinish(heroId);
    }
  }
};

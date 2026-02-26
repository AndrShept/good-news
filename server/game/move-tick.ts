import type { WalkMapUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { PathNode } from '@/shared/types';

import { io } from '..';
import { serverState } from './state/server-state';
import { heroOffline } from '../lib/heroOffline';

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
      const socketData: WalkMapUpdateEvent = { type: 'WALK_MAP_UPDATE', payload: { heroId, x: step.x, y: step.y } };

      heroState.location.x = step.x;
      heroState.location.y = step.y;
      io.to(step.mapId).emit(socketEvents.walkMap(), socketData);
    }

    if (!paths.length && lastStep) {
      io.to(lastStep.mapId).emit(socketEvents.walkMap(), {
        type: 'WALK_MAP_COMPLETE',
        payload: { heroId: heroId, state: 'IDLE' },
      });
      serverState.pathPersistQueue.set(heroId, {
        x: lastStep.x,
        y: lastStep.y,
      });
      const heroState = serverState.hero.get(heroId);
      if (heroState) {
        heroState.state = 'IDLE';
      }
    }
  }

};

import type { WalkMapUpdateData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { PathNode } from '@/shared/types';

import { io } from '..';
import { serverState } from './state/hero-state';

export const moveTick = () => {
  setInterval(() => {
    for (const [heroId, { paths }] of serverState.hero.entries()) {
      if (!paths?.length) continue;
      const now = Date.now();
      const nextPath = paths[0];
      let lastStep: PathNode | null = null;
      if (nextPath.completedAt <= now) {
        const step = paths.shift();
        if (!step) continue;
        lastStep = step;
        const socketData: WalkMapUpdateData = { type: 'WALK_MAP_UPDATE', payload: { heroId, x: step.x, y: step.y } };
        const heroState = serverState.hero.get(heroId);
        if (!heroState) return;
        heroState.x = step.x;
        heroState.y = step.y;
        io.to(step.mapId).emit(socketEvents.walkMap(), socketData);
        serverState.pathPersistQueue.push({
          heroId,
          x: lastStep.x,
          y: lastStep.y,
        });
      }
      // if (!paths.length && lastStep) {

      // }
    }
  }, 200);
};

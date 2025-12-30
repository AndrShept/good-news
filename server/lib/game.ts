import type { WalkMapData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { PathNode } from '@/shared/types';
import { eq } from 'drizzle-orm';
import type { Socket } from 'socket.io';

import { io } from '..';
import { db } from '../db/db';
import { heroTable, locationTable } from '../db/schema';
import { inviteGroup } from './inviteGroup';
import { joinRoom } from './joinRoom';
import { leaveRoom } from './leaveRoom';

export const heroPath = new Map<string, PathNode[]>();

const moveTick = (socket: Socket) => {
  const persistQueue: { heroId: string; x: number; y: number }[] = [];
  setInterval( () => {
    for (const [heroId, path] of heroPath.entries()) {
      if (!path.length) continue;
      const now = Date.now();
      const nextPath = path[0];
      let lastStep: PathNode | null = null;
      if (nextPath.completedAt <= now) {
        const step = path.shift();
        if (!step) continue;
        lastStep = step;
        const data: WalkMapData = { heroId, x: step.x, y: step.y };
        io.to(step.mapId).emit(socketEvents.walkMap(), data);
      }
      if (!path.length && lastStep) {
        heroPath.delete(heroId);

        persistQueue.push({
          heroId,
          x: lastStep.x,
          y: lastStep.y,
        });
      }
    }
  }, 200);

  setInterval(async () => {
    while (persistQueue.length) {
      const p = persistQueue.shift();
      if (!p) continue;
      await db.update(heroTable).set({ state: 'IDLE' }).where(eq(heroTable.id, p.heroId));
      await db.update(locationTable).set({ x: p.x, y: p.y, targetX: null, targetY: null }).where(eq(locationTable.heroId, p.heroId));
    }
  }, 1000);
};
export const game = async (socket: Socket) => {
  inviteGroup(socket);
  joinRoom(socket);
  leaveRoom(socket);
  moveTick(socket);
};

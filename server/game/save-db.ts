import { socketEvents } from '@/shared/socket-events';
import { eq } from 'drizzle-orm';

import { io } from '..';
import { db } from '../db/db';
import { locationTable } from '../db/schema';
import { delay } from '../lib/utils';
import { heroService } from '../services/hero-service';
import { serverState } from './state/hero-state';

export const saveDb = {
  async walkMapComplete() {
    while (true) {
      const p = serverState.pathPersistQueue.shift();
      if (!p) {
        await delay(200);
        continue;
      }
      const heroState = serverState.hero.get(p.heroId);
      if (!heroState) continue;
      if (!heroState.paths?.length) {
        const { mapId } = await heroService(db).walkMapCOmplete(p.heroId, { x: p.x, y: p.y });
        io.to(mapId).emit(socketEvents.walkMap(), {
          type: 'WALK_MAP_COMPLETE',
          payload: { heroId: p.heroId, state: 'IDLE' },
        });
      } else {
        await db
          .update(locationTable)
          .set({
            x: p.x,
            y: p.y,
          })
          .where(eq(locationTable.heroId, p.heroId));
      }

      await delay(1000);
    }
  },
};

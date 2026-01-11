import { db } from '../db/db';
import { delay } from '../lib/utils';
import { heroService } from '../services/hero-service';
import { serverState } from './state/server-state';

export const saveDb = {
  async walkMapComplete() {
    while (true) {
      console.time('DB PATH SAVE ✔');
      for (const [heroId, pos] of serverState.pathPersistQueue.entries()) {
        const heroState = serverState.hero.get(heroId);
        if (!heroState) continue;
        try {
          await db.transaction(async (tx) => {
            await heroService(tx).walkMapCOmplete(heroId, { x: pos.x, y: pos.y });
            serverState.pathPersistQueue.delete(heroId);
          });
        } catch (err) {
          console.error('Failed to save hero path', heroId, err);
        }
      }
      console.timeEnd('DB PATH SAVE ✔');

      await delay(600000);
    }
  },
};

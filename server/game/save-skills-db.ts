import { SAVE_DB_INTERVAL } from '@/shared/constants';
import { eq, inArray } from 'drizzle-orm';

import { db } from '../db/db';
import { itemInstanceTable, skillInstanceTable } from '../db/schema';
import { delay } from '../lib/utils';
import { serverState } from './state/server-state';

export async function saveSkillsDb() {
  const TIME = 60_000;
  while (true) {
    const eventsToProcess = [...serverState.skillInstancePendingDeltaEvents];

    if (eventsToProcess.length === 0) {
      await delay(TIME);
      continue;
    }

    const start = performance.now();

    const updates = eventsToProcess.filter((e) => e.type === 'UPDATE');

    try {
      await db.transaction(async (tx) => {
        for (const event of updates) {
          await tx
            .update(skillInstanceTable)
            .set({ ...event.updateData })
            .where(eq(skillInstanceTable.id, event.skillInstanceId));
        }
      });

      for (const event of eventsToProcess) {
        serverState.skillInstancePendingDeltaEvents.delete(event);
      }
    } catch (err) {
      console.error('Failed to save skill instances!', err);
    }

    const elapsed = performance.now() - start;
    console.info(`SKILLS SAVE ${elapsed.toFixed(2)}ms - ${eventsToProcess.length} events (C:${'0'} U:${updates.length} D:${'0'})`);

    await delay(TIME);
  }
}

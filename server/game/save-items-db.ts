import { SAVE_DB_INTERVAL } from '@/shared/constants';
import { eq, inArray } from 'drizzle-orm';

import { db } from '../db/db';
import { itemInstanceTable } from '../db/schema';
import { delay } from '../lib/utils';
import { serverState } from './state/server-state';

export async function saveItemsDb() {
  while (true) {
    const eventsToProcess = [...serverState.itemInstancePendingDeltaEvents];

    if (eventsToProcess.length === 0) {
      await delay(SAVE_DB_INTERVAL);
      continue;
    }

    const start = performance.now();
    const creates = eventsToProcess.filter((e) => e.type === 'CREATE');
    const updates = eventsToProcess.filter((e) => e.type === 'UPDATE');
    const deletes = eventsToProcess.filter((e) => e.type === 'DELETE');

    try {
      await db.transaction(async (tx) => {
        if (creates.length) {
          await tx.insert(itemInstanceTable).values(creates.map((e) => e.item));
        }

        if (deletes.length) {
          await tx.delete(itemInstanceTable).where(
            inArray(
              itemInstanceTable.id,
              deletes.map((e) => e.itemInstanceId),
            ),
          );
        }

        for (const event of updates) {
          await tx
            .update(itemInstanceTable)
            .set({ ...event.updateData })
            .where(eq(itemInstanceTable.id, event.itemInstanceId));
        }
      });

      for (const event of eventsToProcess) {
        serverState.itemInstancePendingDeltaEvents.delete(event);
      }
    } catch (err) {
      console.error('Failed to save item instances!', err);
    }

    const elapsed = performance.now() - start;
    console.info(
      `ITEMS SAVE ${elapsed.toFixed(2)}ms - ${eventsToProcess.length} events (C:${creates.length} U:${updates.length} D:${deletes.length})`,
    );

    await delay(SAVE_DB_INTERVAL);
  }
}

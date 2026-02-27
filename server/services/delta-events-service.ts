import type { itemInstanceTable, skillInstanceTable } from '../db/schema';
import { serverState } from '../game/state/server-state';

export const deltaEventsService = {
  itemInstance: {
    create(newItem: typeof itemInstanceTable.$inferInsert) {
      serverState.itemInstancePendingDeltaEvents.add({
        type: 'CREATE',
        item: newItem,
      });
    },
    update(itemInstanceId: string, updateData: Partial<typeof itemInstanceTable.$inferInsert>) {
      serverState.itemInstancePendingDeltaEvents.add({
        type: 'UPDATE',
        itemInstanceId,
        updateData,
      });
    },
    delete(itemInstanceId: string) {
      serverState.itemInstancePendingDeltaEvents.add({
        type: 'DELETE',
        itemInstanceId,
      });
    },
  },

  skillInstance: {
    update(skillInstanceId: string, updateData: Partial<typeof skillInstanceTable.$inferInsert>) {
      serverState.skillInstancePendingDeltaEvents.add({
        type: 'UPDATE',
        skillInstanceId,
        updateData,
      });
    },
  },
};

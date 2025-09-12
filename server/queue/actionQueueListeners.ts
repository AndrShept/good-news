import type { MapUpdateEvent, TownUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { JobNameType, WalkMapJobData, WalkTownJobData } from '@/shared/types';

import { io } from '..';
import { queueEvents } from './actionQueue';

export const actionQueueListeners = () => {
  queueEvents.on('completed', async ({ jobId, returnvalue }) => {
    if (!returnvalue) {
      console.error('returnvalue , not found');
      return;
    }
    const value = returnvalue as unknown as { jobName: JobNameType };
    if (value.jobName === 'WALK:TOWN') {
      const jobData = returnvalue as unknown as WalkTownJobData;
      const socketData: TownUpdateEvent = {
        payload: jobData,
        type: 'WALK_TOWN',
      };
      io.to(jobData.heroId).emit(socketEvents.townUpdate(), socketData);
    }
    if (value.jobName === 'WALK:MAP') {
      const jobData = returnvalue as unknown as WalkMapJobData;
      const socketData: MapUpdateEvent = {
        payload: jobData,
        type: 'WALK_MAP',
      };
      io.to(jobData.tile.mapId).emit(socketEvents.mapUpdate(), socketData);
    }
  });

  queueEvents.on('failed', ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error('actionQueueListeners queueEvents ERROR ', failedReason);
  });
};

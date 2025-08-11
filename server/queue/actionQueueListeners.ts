import { socketEvents } from '@/shared/socket-events';
import type { WalkTownJobData } from '@/shared/types';

import { io } from '..';
import { queueEvents } from './actionQueue';

export const actionQueueListeners = () => {
  queueEvents.on('completed', async ({ jobId, returnvalue }) => {
    console.log('@@returnvalue@@@', returnvalue);
    const jobData = returnvalue as unknown as WalkTownJobData;
    io.to(jobData.heroId).emit(socketEvents.actionWalkTownComplete(), jobData);
  });

  queueEvents.on('failed', ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error('error painting', failedReason);
  });
};

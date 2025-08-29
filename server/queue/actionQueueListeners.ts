import { socketEvents } from '@/shared/socket-events';
import type { JobNameType, WalkMapJobData, WalkTownJobData } from '@/shared/types';

import { io } from '..';
import { queueEvents } from './actionQueue';

export const actionQueueListeners = () => {
  queueEvents.on('completed', async ({ jobId, returnvalue }) => {
    console.log('@@returnvalue@@@', returnvalue);
    if (!returnvalue) {
      console.error('returnvalue , not found');
      return;
    }
    const value = returnvalue as unknown as { jobName: JobNameType };
    if (value.jobName === 'WALK:TOWN') {
      const jobData = returnvalue as unknown as WalkTownJobData;
      io.to(jobData.heroId).emit(socketEvents.actionWalkTownComplete(), jobData);
    }
    if (value.jobName === 'WALK:MAP') {
       const jobData = returnvalue as unknown as WalkMapJobData;
        io.to(jobData.heroId).emit(socketEvents.actionWalkMapComplete(), jobData);
    }
  });

  queueEvents.on('failed', ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error('error painting', failedReason);
  });
};

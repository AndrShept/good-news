import type { ActionJobEvent, HeroOfflineJob } from '@/shared/job-types';
import type { HeroOfflineData, MapUpdateEvent, TownUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { io } from '..';
import { queueEvents } from './actionQueue';

export const actionQueueListeners = () => {
  queueEvents.on('completed', async ({ jobId, returnvalue }) => {
    if (!returnvalue) {
      console.error('returnvalue , not found');
      return;
    }
    const jobData = returnvalue as unknown as ActionJobEvent;

    switch (jobData.jobName) {
      case 'WALK_TOWN': {
        const socketData: TownUpdateEvent = {
          payload: jobData.payload,
          type: 'WALK_TOWN',
        };
        io.to(jobData.payload.heroId).emit(socketEvents.townUpdate(), socketData);
        break;
      }
      case 'WALK_MAP': {
        const socketData: MapUpdateEvent = {
          payload: jobData.payload,
          type: 'WALK_MAP',
        };
        io.to(jobData.payload.mapId).emit(socketEvents.mapUpdate(), socketData);
        break;
      }
      case 'HERO_OFFLINE': {
        const socketData: HeroOfflineData = {
          payload: jobData.payload,
          type: 'HERO_OFFLINE',
        };
        if (jobData.payload.mapId) {
          io.to(jobData.payload.mapId).emit(socketEvents.mapUpdate(), socketData);
        }
        if (jobData.payload.townId) {
          io.to(jobData.payload.townId).emit(socketEvents.townUpdate(), socketData);
        }

        break;
      }
    }
  });

  queueEvents.on('failed', ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error('actionQueueListeners queueEvents ERROR ', failedReason);
  });

  queueEvents.on('progress', ({ jobId, data }) => {
    console.log('data', data);
    console.log('jobId', jobId);
  });
};

import type { ActionJobEvent, BuffCreateJob, HeroOfflineJob } from '@/shared/job-types';
import type { HeroOfflineData, MapUpdateEvent, PlaceUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { and, eq } from 'drizzle-orm';

import { io } from '..';
import { db } from '../db/db';
import { buffTable, gameItemTable, heroTable, modifierTable } from '../db/schema';
import { combineModifiers } from '../lib/utils';
import { heroService } from '../services/hero-service';
import { queueEvents } from './actionQueue';

export const actionQueueListeners = () => {
  queueEvents.on('completed', async ({ jobId, returnvalue }) => {
    if (!returnvalue) {
      // console.error('returnvalue , not found');
      return;
    }
    const jobData = returnvalue as unknown as ActionJobEvent;

    switch (jobData.jobName) {
      case 'WALK_PLACE': {
        const socketData: PlaceUpdateEvent = {
          payload: jobData.payload,
          type: 'WALK_PLACE',
        };
        io.to(jobData.payload.heroId).emit(socketEvents.placeUpdate(), socketData);
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
        if (jobData.payload.placeId) {
          io.to(jobData.payload.placeId).emit(socketEvents.placeUpdate(), socketData);
        }

        break;
      }
      case 'BUFF_CREATE':
        const socketData: BuffCreateJob = {
          jobName: 'BUFF_CREATE',
          payload: { gameItemId: jobData.payload.gameItemId, heroId: jobData.payload.heroId },
        };
        io.to(jobData.payload.heroId).emit(socketEvents.dataSelf(), socketData);
        break;
      case 'REGEN_HEALTH':
        io.to(jobData.payload.heroId).emit(socketEvents.dataSelf(), jobData);
        break;
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

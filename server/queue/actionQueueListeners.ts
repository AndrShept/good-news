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
      console.error('returnvalue , not found');
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
        await db.transaction(async (tx) => {
          const modifier = await tx.query.modifierTable.findFirst({
            where: eq(modifierTable.heroId, jobData.payload.heroId),
          });
          const gameItem = await tx.query.gameItemTable.findFirst({
            where: eq(gameItemTable.id, jobData.payload.gameItemId),
            with: {
              potion: true,
            },
          });
          if (!modifier) {
            throw new Error('modifier not found');
          }
          const combinedModifier = combineModifiers(modifier, 'subtract', gameItem?.potion?.buffInfo?.modifier!);
          if (!combinedModifier) {
            throw new Error('combinedModifier not found');
          }

          await tx
            .delete(buffTable)
            .where(and(eq(buffTable.heroId, jobData.payload.heroId), eq(buffTable.gameItemId, jobData.payload.gameItemId)));
          await heroService(tx).updateModifier(jobData.payload.heroId);
        });

        io.to(jobData.payload.heroId).emit(socketEvents.dataSelf(), socketData);
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

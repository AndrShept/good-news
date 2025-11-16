import type { ActionJobEvent, BuffCreateJob, HeroOfflineJob } from '@/shared/job-types';
import type {
  HeroOfflineData,
  MapUpdateEvent,
  PlaceUpdateEvent,
  QueueCraftItemSocketData,
  SelfHeroData,
  SelfMessageData,
} from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { and, eq, ne } from 'drizzle-orm';

import { io } from '..';
import type { GameMessageType } from '../../frontend/src/store/useGameMessages';
import { db } from '../db/db';
import { buffTable, gameItemTable, heroTable, modifierTable, queueCraftItemTable } from '../db/schema';
import { heroService } from '../services/hero-service';
import { actionQueue,  queueEvents } from './actionQueue';

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

        io.to(jobData.payload.heroId).emit(socketEvents.selfData(), socketData);
        break;
      case 'REGEN_HEALTH':
        if (jobData.payload.isComplete) {
          const messageData: SelfMessageData = {
            message: 'Stop health regen ',
            type: 'error',
          };
          io.to(jobData.payload.heroId).emit(socketEvents.selfMessage(), messageData);
        }
        break;
      case 'REGEN_MANA':
        if (jobData.payload.isComplete) {
          const messageData: SelfMessageData = {
            message: 'Stop mana regen ',
            type: 'error',
          };
          io.to(jobData.payload.heroId).emit(socketEvents.selfMessage(), messageData);
        }
        break;
      case 'QUEUE_CRAFT_ITEM':
        const data: QueueCraftItemSocketData = {
          type: 'QUEUE_CRAFT_ITEM_COMPLETE',
          payload: {
            queueItemCraftId: jobData.payload.queueCraftItemId,
          },
        };
        const queueCraftItem = await db.query.queueCraftItemTable.findFirst({
          where: and(eq(queueCraftItemTable.heroId, jobData.payload.heroId), eq(queueCraftItemTable.status, 'PENDING')),
        });
        if (queueCraftItem) {
          const updateData: QueueCraftItemSocketData = {
            type: 'QUEUE_CRAFT_ITEM_STATUS_UPDATE',
            payload: {
              queueItemCraftId: queueCraftItem.id,
              status: 'PROGRESS',
            },
          };
          io.to(jobData.payload.heroId).emit(socketEvents.queueCraft(), updateData);
        }
        io.to(jobData.payload.heroId).emit(socketEvents.queueCraft(), data);
    }
  });

  queueEvents.on('progress', ({ jobId, data }) => {
    const progressData = data as unknown as SelfHeroData;

    switch (progressData.jobName) {
      case 'REGEN_HEALTH':
        io.to(progressData.payload.heroId).emit(socketEvents.selfData(), progressData);
        break;
      case 'REGEN_MANA':
        io.to(progressData.payload.heroId).emit(socketEvents.selfData(), progressData);
        break;
    }
  });

  queueEvents.on('failed', async ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error('actionQueueListeners queueEvents ERROR ', failedReason);

    const jobData = await actionQueue.getJob(jobId);
    switch (jobData?.data?.jobName) {
      case 'QUEUE_CRAFT_ITEM':
        const selfMessageData: SelfMessageData = {
          type: 'error',
          message: failedReason,
        };
        const updateQueueCraftDataFailed: QueueCraftItemSocketData = {
          type: 'QUEUE_CRAFT_ITEM_STATUS_UPDATE',
          payload: {
            status: 'FAILED',
            queueItemCraftId: jobData.data.payload.queueCraftItemId,
          },
        };
        await db
          .update(queueCraftItemTable)
          .set({ status: 'FAILED' })
          .where(eq(queueCraftItemTable.id, jobData.data.payload.queueCraftItemId));
        io.to(jobData.data.payload.heroId).emit(socketEvents.selfMessage(), selfMessageData);
        io.to(jobData.data.payload.heroId).emit(socketEvents.queueCraft(), updateQueueCraftDataFailed);
        const findNextQueue = await db.query.queueCraftItemTable.findFirst({
          where: and(eq(queueCraftItemTable.heroId, jobData.data.payload.heroId), eq(queueCraftItemTable.status, 'PENDING')),
        });
        if (findNextQueue) {
          const updateQueueCraftDataProgress: QueueCraftItemSocketData = {
            type: 'QUEUE_CRAFT_ITEM_STATUS_UPDATE',
            payload: {
              status: 'PROGRESS',
              queueItemCraftId: findNextQueue.id,
            },
          };
          io.to(jobData.data.payload.heroId).emit(socketEvents.queueCraft(), updateQueueCraftDataProgress);
        }
        break;
    }
  });

}
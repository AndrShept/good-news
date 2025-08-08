import { socketEvents } from '@/shared/socket-events';
import { Queue, QueueEvents } from 'bullmq';

import { io } from '..';
import type { BuildingType } from '@/shared/types';

type WalkTownJobData = {
  actionId: string;
  type: 'IDLE'
  heroId: string;
  target : BuildingType
};

const connectionConfig = {
  host: process.env['UPSTASH_REDIS_REST'],
  port: 6379,
  password: process.env['UPSTASH_REDIS_REST_TOKEN'],
  tls: {},
};

export const actionQueue = new Queue('hero-action', {
  connection: connectionConfig,

});
const queueEvents = new QueueEvents('hero-action', {
  connection: connectionConfig,
});
export const upstashRedis = () => {
  queueEvents.on('completed', async ({ jobId, returnvalue }) => {
    console.log('@@returnvalue@@@', returnvalue);
    const { heroId } = returnvalue as unknown as { heroId: string };
    io.to(heroId).emit(socketEvents.actionComplete(), { ok: true });
  });

  queueEvents.on('failed', ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
    console.error('error painting', failedReason);
  });
};

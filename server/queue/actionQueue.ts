import { Queue, QueueEvents } from 'bullmq';

import { redis as connection } from './redisConfig';

export const actionQueue = new Queue('hero-action', {
  connection,
});
export const queueEvents = new QueueEvents('hero-action', {
  connection,
});

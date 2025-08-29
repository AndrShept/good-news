import type { ActionJobData, WalkMapJobData, WalkTownJobData } from '@/shared/types';
import { Queue, QueueEvents } from 'bullmq';

import { redis as connection } from './redisConfig';



export const actionQueue = new Queue<ActionJobData>('hero-action', {
  connection,
});
export const queueEvents = new QueueEvents('hero-action', {
  connection,
});

import { type HeroOfflineJob, jobName } from '@/shared/job-types';
import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { locationTable } from '../db/schema';
import { actionQueue } from '../queue/actionQueue';
import { jobQueueId } from './utils';

export const heroOffline = async (heroId: string) => {
  const location = await db.query.locationTable.findFirst({
    where: eq(locationTable.heroId, heroId),
  });
  const jobId = jobQueueId.offline(heroId);

  const jobData: HeroOfflineJob = {
    jobName: 'HERO_OFFLINE',
    payload: {
      heroId,
      mapId: location?.mapId ?? '',
      placeId: location?.placeId ?? '',
    },
  };
  actionQueue.remove(jobId);
  actionQueue.add(jobName['hero-offline'], jobData, {
    delay: 10_000,
    jobId,
    removeOnComplete: true,
  });
  console.log('OFFLINE ACTION ADD');
};

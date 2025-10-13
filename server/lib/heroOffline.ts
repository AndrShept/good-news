import { type HeroOfflineJob, jobName } from '@/shared/job-types';
import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { heroTable } from '../db/schema';
import { actionQueue } from '../queue/actionQueue';
import { jobQueueId } from './utils';

export const heroOffline = async (heroId: string) => {
  const hero = await db.query.heroTable.findFirst({
    where: eq(heroTable.id, heroId),
    with: { location: true },
  });
  if (!hero) {
    console.error('heroOffline func hero not found');
    return;
  }
  if (!hero.location) {
    console.error('heroOffline func hero location not found');
    return;
  }
  const jobId = jobQueueId.offline(hero.id);

  const jobData: HeroOfflineJob = {
    jobName: 'HERO_OFFLINE',
    payload: {
      heroId: hero.id,
      mapId: hero.location.mapId ?? '',
      placeId: hero.location.placeId ?? '',
    },
  };
  await actionQueue.remove(jobId);
  await actionQueue.add(jobName['hero-offline'], jobData, {
    delay: 10_000,
    jobId,
    removeOnComplete: true,
  });
};

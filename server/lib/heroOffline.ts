import { type HeroOfflineJob, jobName } from '@/shared/job-types';
import { socketEvents } from '@/shared/socket-events';
import { eq } from 'drizzle-orm';

import { io } from '..';

import { serverState } from '../game/state/server-state';
import { actionQueue } from '../queue/actionQueue';
import { jobQueueId } from './utils';

export const heroOffline = async (heroId: string) => {
  // const location = await db.query.locationTable.findFirst({
  //   where: eq(locationTable.heroId, heroId),
  // });
  // const jobId = jobQueueId.offline(heroId);
  const heroState = serverState.hero.get(heroId);
  if (!heroState) return;
  const socketData: HeroOfflineJob = {
    jobName: 'HERO_OFFLINE',
    payload: {
      heroId,
      mapId: heroState.location.mapId ?? '',
      placeId: heroState.location.placeId ?? '',
    },
  };
  if (heroState.location.mapId) {
    io.to(heroState.location.mapId).emit(socketEvents.mapUpdate(), socketData);
  }
  if (heroState.location.placeId) {
    io.to(heroState.location.placeId).emit(socketEvents.placeUpdate(), socketData);
  }
  // actionQueue.remove(jobId);
  // actionQueue.add(jobName['hero-offline'], jobData, {
  //   delay: 10_000,
  //   jobId,
  //   removeOnComplete: true,
  // });
};

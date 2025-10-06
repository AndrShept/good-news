import type { HeroOnlineData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { db } from '../db/db';
import { heroTable, locationTable } from '../db/schema';
import { actionQueue } from '../queue/actionQueue';
import { jobQueueId } from './utils';

export const heroOnline = async (heroId: string) => {
  const jobId = jobQueueId.offline(heroId);
  await actionQueue.remove(jobId);

  const location = await db.query.locationTable.findFirst({
    where: eq(locationTable.heroId, heroId),
    with: { hero: true },
  });
  if (!location) {
    throw new HTTPException(404, {
      message: 'location not found',
    });
  }
  const socketData: HeroOnlineData = {
    type: 'HERO_ONLINE',
    payload: location,
  };

  await db
    .update(heroTable)
    .set({
      isOnline: true,
    })
    .where(eq(heroTable.id, heroId));

  if (location.mapId) {
    io.to(location.mapId).emit(socketEvents.mapUpdate(), socketData);
  }
  if (location.townId) {
    io.to(location.townId).emit(socketEvents.townUpdate(), socketData);
  }
};

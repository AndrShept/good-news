import type { HeroOnlineData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { db } from '../db/db';
import { heroTable, locationTable } from '../db/schema';
import { serverState } from '../game/state/server-state';
import { actionQueue } from '../queue/actionQueue';
import { jobQueueId } from './utils';

export const heroOnline = async (heroId: string) => {
  // const jobId = jobQueueId.offline(heroId);
  // await actionQueue.remove(jobId);

  // const location = await db.query.locationTable.findFirst({
  //   where: eq(locationTable.heroId, heroId),
  //   with: { hero: true },
  // });
  // if (!location) {
  //   throw new HTTPException(404, {
  //     message: 'location not found',
  //   });
  // }
  const heroState = serverState.hero.get(heroId);
  if (!heroState) return;
  const socketData: HeroOnlineData = {
    type: 'HERO_ONLINE',
    payload: {
      id: heroState.id,
      avatarImage: heroState.avatarImage,
      characterImage: heroState.characterImage,
      level: heroState.level,
      name: heroState.name,
      state: heroState.state,
      x: heroState.location.x,
      y: heroState.location.y,
    },
  };

  await db
    .update(heroTable)
    .set({
      isOnline: true,
    })
    .where(eq(heroTable.id, heroId));

  if (heroState.location.mapId) {
    io.to(heroState.location.mapId).emit(socketEvents.mapUpdate(), socketData);
  }
  if (heroState.location.placeId) {
    io.to(heroState.location.placeId).emit(socketEvents.placeUpdate(), socketData);
  }
};

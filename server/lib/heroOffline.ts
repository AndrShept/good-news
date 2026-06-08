import type { HeroOfflineEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { io } from '..';
import { type HeroRuntime } from '../game/state/server-state';
import { mapService } from '../services/map-service';

export const heroOffline = async (hero: HeroRuntime) => {
  const socketData: HeroOfflineEvent = {
    type: 'HERO_OFFLINE',
    payload: {
      heroId: hero.id,
      mapId: hero.location.mapId ?? '',
      placeId: hero.location.placeId ?? '',
    },
  };
  hero.isOnline = false;
  if (hero.location.chunkId && hero.location.mapId) {
    mapService.despawnMapEntitiesInChunk({
      type: 'HERO',
      entityId: hero.id,
      mapId: hero.location.mapId,
      x: hero.location.x,
      y: hero.location.y,
    });
  }
  if (hero.location.placeId) {
    io.to(hero.location.placeId).emit(socketEvents.placeUpdate(), socketData);
  }
};

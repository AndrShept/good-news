import type { HeroOnlineEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { io } from '..';
import { heroService } from '../services/hero-service';
import { mapService } from '../services/map-service';

export const heroOnline = async (heroId: string) => {
  const heroState = heroService.getHero(heroId);
  heroState.offlineTimer = undefined;
  const mapHeroData = heroService.getHeroMapData(heroId);
  const socketData: HeroOnlineEvent = {
    type: 'HERO_ONLINE',
    payload: mapHeroData,
  };

  if (heroState.location.mapId) {
    mapService.spawnMapEntitiesInChunk({
      x: heroState.location.x,
      y: heroState.location.y,
      mapId: heroState.location.mapId,
      type: 'HERO',
      entityId: heroId,
    });
  }
  if (heroState.location.placeId) {
    io.to(heroState.location.placeId).emit(socketEvents.placeUpdate(), socketData);
  }
};

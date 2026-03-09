import type { HeroOnlineEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { io } from '..';
import { heroService } from '../services/hero-service';
import { mapService } from '../services/map-service';
import { socketService } from '../services/socket-service';

export const heroOnline = async (heroId: string) => {
  const hero = heroService.getHero(heroId);
  hero.offlineTimer = undefined;
  const mapHeroData = heroService.getHeroMapData(heroId);
  const socketData: HeroOnlineEvent = {
    type: 'HERO_ONLINE',
    payload: mapHeroData,
  };

  if (hero.location.chunkId && hero.location.mapId) {
   
    mapService.spawnMapEntitiesInChunk({ type: 'HERO', entityId: hero.id, x: hero.location.x, y: hero.location.y , mapId: hero.location.mapId });
    socketService.sendMapChunkSpawnEntities({ chunkId: hero.location.chunkId, entityId: hero.id, type: 'HERO' });
  }
  if (hero.location.placeId) {
    io.to(hero.location.placeId).emit(socketEvents.placeUpdate(), socketData);
  }
};

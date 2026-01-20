import { socketEvents } from '@/shared/socket-events';


import { io } from '..';

import { serverState } from '../game/state/server-state';
import { heroService } from '../services/hero-service';
import type { HeroOfflineData } from '@/shared/socket-data-types';

export const heroOffline = async (heroId: string, userId: string) => {

  const heroState = heroService.getHero(heroId)

  const socketData: HeroOfflineData = {
    type: 'HERO_OFFLINE',
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
  serverState.user.delete(userId)
  serverState.hero.delete(heroId)
  serverState.skill.delete(heroId)

};

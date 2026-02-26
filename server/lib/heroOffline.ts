import type { HeroOfflineEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { io } from '..';
import { serverState } from '../game/state/server-state';
import { heroService } from '../services/hero-service';

export const heroOffline = async (heroId: string, userId: string) => {
  const hero = heroService.getHero(heroId);

  const socketData: HeroOfflineEvent = {
    type: 'HERO_OFFLINE',
    payload: {
      heroId,
      mapId: hero.location.mapId ?? '',
      placeId: hero.location.placeId ?? '',
    },
  };
  if (hero.location.mapId) {
    io.to(hero.location.mapId).emit(socketEvents.mapUpdate(), socketData);
  }
  if (hero.location.placeId) {
    io.to(hero.location.placeId).emit(socketEvents.placeUpdate(), socketData);
  }
  serverState.user.delete(userId);
  serverState.hero.delete(heroId);
  serverState.skill.delete(heroId);
  serverState.socket.delete(heroId);
};

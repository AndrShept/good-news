import type { HeroOnlineData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { io } from '..';
import { heroService } from '../services/hero-service';
import { socketService } from '../services/socket-service';

export const heroOnline = async (heroId: string) => {
  const heroState = heroService.getHero(heroId);
  heroState.offlineTimer = undefined;
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

  if (heroState.location.mapId) {
    io.to(heroState.location.mapId).emit(socketEvents.mapUpdate(), socketData);

  }
  if (heroState.location.placeId) {
    io.to(heroState.location.placeId).emit(socketEvents.placeUpdate(), socketData);
  }
};

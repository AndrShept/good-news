import type { HeroUpdateStateData, MapUpdateData, PlaceUpdateData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { StateType } from '@/shared/types';

import { io } from '..';
import { heroService } from './hero-service';

export const socketService = {
  sendToPlaceUpdateState(heroId: string, placeId: string | null, state: StateType) {
    if (!placeId) return;
    const socketData: HeroUpdateStateData = {
      type: 'UPDATE_STATE',
      payload: {
        heroId,
        state,
      },
    };
    io.to(placeId).emit(socketEvents.placeUpdate(), socketData);
  },
  sendMapAddHero(heroId: string, mapId: string) {
    const hero = heroService.getHero(heroId);
    const data: MapUpdateData = {
      type: 'ADD_HERO',
      payload: {
        heroId: hero.id,
        mapId,
        hero: {
          id: hero.id,
          name: hero.name,
          avatarImage: hero.avatarImage,
          characterImage: hero.characterImage,
          level: hero.level,
          state: hero.state,
          x: hero.location.x,
          y: hero.location.y,
        },
      },
    };

    io.to(mapId).emit(socketEvents.mapUpdate(), data);
  },
  sendMapRemoveHero(heroId: string, mapId: string, placeId: string) {
    const hero = heroService.getHero(heroId);
    const data: MapUpdateData = {
      type: 'REMOVE_HERO',
      payload: {
        placeId,
        heroId: hero.id,
      },
    };

    io.to(mapId).emit(socketEvents.mapUpdate(), data);
  },
  sendPlaceRemoveHero(heroId: string, mapId: string, placeId: string) {
    const hero = heroService.getHero(heroId);
    const data: PlaceUpdateData = {
      type: 'REMOVE_HERO',
      payload: {
        heroId: hero.id,
        mapId,
      },
    };

    io.to(placeId).emit(socketEvents.placeUpdate(), data);
  },
  sendPlaceAddHero(heroId: string, placeId: string) {
    const hero = heroService.getHero(heroId);
    const data: PlaceUpdateData = {
      type: 'ADD_HERO',
      payload: {
        id: hero.id,
        avatarImage: hero.avatarImage,
        level: hero.level,
        name: hero.name,
        state: hero.state,
      },
    };

    io.to(placeId).emit(socketEvents.placeUpdate(), data);
  },
};

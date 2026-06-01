import { placeTemplate } from '@/shared/templates/place-template';
import type { TPlace } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';
import type { Socket } from 'socket.io';

import type { HeroRuntime } from '../game/state/server-state';
import { mapService } from './map-service';
import { socketService } from './socket-service';

interface OnEnterToPlaceParam {
  place: TPlace;
  hero: HeroRuntime;
}

export const placeService = {
  getPlace(placeId: string) {
    const place = placeTemplate.find((p) => p.id === placeId);
    if (!place) throw new HTTPException(400, { message: 'place not found' });
    return place;
  },

  onEnterToPlace({ hero, place }: OnEnterToPlaceParam) {
    const socket = socketService.getSocket(hero.id);
    const chunksIds = mapService.getAroundChunkIds({ x: hero.location.x, y: hero.location.y, mapId: hero.location.mapId! });
    for (const chunkId of chunksIds) {
      socket.leave(chunkId);
    }

    hero.location.mapId = null;
    hero.location.chunkId = null;
    hero.location.placeId = place.id;

    mapService.despawnMapEntitiesInChunk({ entityId: hero.id, type: 'HERO', mapId: place.mapId, x: place.x, y: place.y });
    socketService.sendPlaceAddHero(hero.id, place.id);
    socketService.sendToClientSysMessage(hero.id, { color: 'GREY', text: `You have entered ${place.name}.` });
  },
  onTeleportNearTown(hero: HeroRuntime) {
    if (!hero.location.mapId) throw new HTTPException(400, { message: 'hero map id not found' });
    const map = mapService.getMap(hero.location.mapId);
    const mapTowns = map.places.filter((p) => p.type === 'TOWN');
    if (!mapTowns.length) throw new HTTPException(400, { message: 'no towns on map' });

    const nearestTown = mapTowns.reduce((nearest, town) => {
      const distToTown = Math.hypot(town.x - hero.location.x, town.y - hero.location.y);
      const distToNearest = Math.hypot(nearest.x - hero.location.x, nearest.y - hero.location.y);
      return distToTown < distToNearest ? town : nearest;
    });

    placeService.onEnterToPlace({ hero, place: nearestTown });
  },
};

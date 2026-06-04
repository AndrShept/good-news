import { mapService } from '../services/map-service';
import { serverState } from './state/server-state';

export const despawnCorpseTick = (now: number) => {
  for (const corpse of serverState.corpse.values()) {
    if (corpse.expiredAt > now) continue;
    mapService.despawnMapEntitiesInChunk({
      entityId: corpse.id,
      type: 'CREATURE',
      mapId: corpse.mapId,
      x: corpse.x,
      y: corpse.y,
    });
  }
};

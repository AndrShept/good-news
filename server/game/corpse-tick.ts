import { mapService } from '../services/map-service';
import { serverState } from './state/server-state';

export const corpseTick = (now: number) => {
  for (const corpse of serverState.corpse.values()) {
    if (corpse.expiredAt <= now) {
      mapService.despawnMapEntitiesInChunk({
        entityId: corpse.id,
        type: 'CORPSE',
        mapId: corpse.mapId,
        x: corpse.x,
        y: corpse.y,
      });
    }

    if (corpse.expiredAt + 60_000 * 20 <= now) {
      serverState.corpse.delete(corpse.id);

      if (corpse.type === 'CREATURE') {
        serverState.creature.delete(corpse.parentEntityId);
      }
    }
  }
};

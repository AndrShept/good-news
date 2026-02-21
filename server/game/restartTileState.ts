import { WORLD_SEED } from '@/shared/constants';

import { gatheringService } from '../services/gathering-service';
import { serverState } from './state/server-state';

export const restartTileState = (now: number) => {
  let i = 0;
  for (const stateTiles of serverState.worldResourceTiles.values()) {
    for (const tile of stateTiles.values()) {
      if (now >= tile.respawnAt && tile.charges < 1) {
        tile.charges = gatheringService.setInitialCharges(tile.x, tile.y, WORLD_SEED);
        tile.respawnAt = gatheringService.setRespawnTileState();
        i++;
      }
    }
  }
  if (i > 0) {
    console.log(`[${new Date().toLocaleTimeString()}]:`, `TILE RESTOCK - ${i}`);
  }
};

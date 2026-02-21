
import type { FinishGatheringData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { io } from '..';
import { gatheringService } from '../services/gathering-service';
import { serverState } from './state/server-state';

export const gatherTick = (now: number) => {
  for (const [heroId, hero] of serverState.hero.entries()) {
    if (!hero.gatheringFinishAt) continue;
    if (now >= hero.gatheringFinishAt) {
      if (!hero.location.mapId) continue;

      switch (hero.state) {
        case 'MINING':
          break;
        case 'FISHING':
          const tileState = gatheringService.getGatherTileState(heroId, 'FISHING');
          if (tileState) {
            --tileState.charges;
          }
     
          break;
      }
      hero.state = 'IDLE';
      hero.gatheringFinishAt = null;

      const socketData: FinishGatheringData = { type: 'FINISH_GATHERING', payload: {} };
      io.to(heroId).emit(socketEvents.selfData(), socketData);
    }
  }
};

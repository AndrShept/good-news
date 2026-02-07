import type { HeroUpdateStateData, MapUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { StateType } from '@/shared/types';

import { io } from '..';

export const socketService = {
  sendMap() {},
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
};

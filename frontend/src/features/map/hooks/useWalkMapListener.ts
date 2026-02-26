import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { WalkMapCompleteEvent, WalkMapStartEvent, WalkMapUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { useEffect } from 'react';

import { useMapHeroesUpdate } from './useMapHeroesUpdate';

export const useWalkMapListener = () => {
  const { mapId } = useHero((data) => ({
    mapId: data?.location?.mapId ?? '',

  }));
  const filterMovementPathTiles = useMovementPathTileStore((state) => state.filterMovementPathTiles);
  const heroId = useHeroId();
  const { socket } = useSocket();
  const { updateHeroes } = useMapHeroesUpdate(mapId);
  const { updateHero } = useHeroUpdate();

  useEffect(() => {
    const listener = (data: WalkMapStartEvent | WalkMapUpdateEvent | WalkMapCompleteEvent) => {
      switch (data.type) {
        case 'WALK_MAP_START': {
          updateHeroes(data.payload.heroId, { state: data.payload.state });
          if (heroId === data.payload.heroId) {
            updateHero({ state: data.payload.state });
          }
          break;
        }
        case 'WALK_MAP_UPDATE': {
          if (heroId === data.payload.heroId) {
            updateHero({
              location: {
                x: data.payload.x,
                y: data.payload.y,
              },
            });

            filterMovementPathTiles({ x: data.payload.x, y: data.payload.y });
          }
          updateHeroes(data.payload.heroId, { x: data.payload.x, y: data.payload.y });
          break;
        }
        case 'WALK_MAP_COMPLETE': {
          updateHeroes(data.payload.heroId, { state: data.payload.state });
          if (heroId === data.payload.heroId) {
            updateHero({ state: data.payload.state, location: { targetX: null, targetY: null } });
          }
          break;
        }
      }
    };
    socket.on(socketEvents.walkMap(), listener);

    return () => {
      socket.off(socketEvents.walkMap(), listener);
    };
  }, [filterMovementPathTiles, heroId, socket, updateHero, updateHeroes]);
};

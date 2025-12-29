import { useSocket } from '@/components/providers/SocketProvider';
import { useMapHeroesUpdate } from '@/features/map/hooks/useMapHeroesUpdate';
import { WalkMapData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { useEffect } from 'react';

import { useHero } from './useHero';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useWalkMapListener = () => {
  const { socket } = useSocket();
  const { updateHero } = useHeroUpdate();
  const heroId = useHeroId();
  const mapId = useHero((data) => data?.location?.mapId ?? '');
  const { updateHeroesPos, deleteHeroes, addHeroes } = useMapHeroesUpdate(mapId);
  const filterMovementPathTiles = useMovementPathTileStore((state) => state.filterMovementPathTiles);
  useEffect(() => {
    const listener = (data: WalkMapData) => {
      console.log(data);
      if (heroId === data.heroId) {
        updateHero({
          location: {
            x: data.x,
            y: data.y,
          },
        });
        filterMovementPathTiles({ x: data.x, y: data.y });
      }
      updateHeroesPos(data.heroId, { x: data.x, y: data.y });
    };
    socket.on(socketEvents.walkMap(), listener);
    return () => {
      socket.off(socketEvents.walkMap(), listener);
    };
  }, [socket]);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { MapChunkDespawnEntityData, MapChunkSpawnEntityData, MapChunkUpdateEntitiesData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { useEffect } from 'react';

import { useMapChunkEntitiesUpdate } from './useMapChunkEntitiesUpdate';

export const useMapListener = () => {
  const { mapId } = useHero((data) => ({
    mapId: data?.location?.mapId ?? '',
  }));
  const { socket } = useSocket();
  const { addChunkEntities, removeChunkEntities, updateChunkEntities } = useMapChunkEntitiesUpdate(mapId);
  const { clearMovementPathTiles, filterMovementPathTiles } = useMovementPathTileStore();
  const { updateHero } = useHeroUpdate();
  const heroId = useHeroId();

  useEffect(() => {
    const spawnListener = (data: MapChunkSpawnEntityData) => {
      addChunkEntities({ ...data });
    };
    const despawnListener = (data: MapChunkDespawnEntityData) => {
      removeChunkEntities(data.payload.entityId, data.type);
    };
    const updateListener = (data: MapChunkUpdateEntitiesData) => {
      if (data.data.type === 'HERO' && heroId === data.entityId && !data.isFinishMove && data.data.payload.x && data.data.payload.y) {
        updateHero({
          location: {
            x: data.data.payload.x,
            y: data.data.payload.y,
          },
        });

        filterMovementPathTiles({ x: data.data.payload.x, y: data.data.payload.y });
      }
      if (data.data.type === 'HERO' && heroId === data.entityId && data.isFinishMove) {
        updateHero({ state: data.data.payload.state, location: { targetX: null, targetY: null } });
        clearMovementPathTiles();
      }
      updateChunkEntities({ ...data });
    };

    socket.on(socketEvents.entitySpawn(), spawnListener);
    socket.on(socketEvents.entityDespawn(), despawnListener);
    socket.on(socketEvents.entityUpdate(), updateListener);

    return () => {
      socket.off(socketEvents.entitySpawn(), spawnListener);
      socket.off(socketEvents.entityDespawn(), despawnListener);
      socket.off(socketEvents.entityUpdate(), updateListener);
    };
  }, [addChunkEntities, filterMovementPathTiles, heroId, removeChunkEntities, socket, updateChunkEntities, updateHero]);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { MapChunkDespawnEntityData, MapChunkSpawnEntityData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useEffect } from 'react';

import { useMapChunkEntitiesUpdate } from './useMapHeroesUpdate';

export const useMapListener = () => {
  const { mapId } = useHero((data) => ({
    mapId: data?.location?.mapId ?? '',
  }));
  const { socket } = useSocket();
  const { addChunkEntities, removeChunkEntities, updateChunkEntities } = useMapChunkEntitiesUpdate(mapId);
  const { updateHero } = useHeroUpdate();
  const id = useHeroId();

  useEffect(() => {
    const spawnListener = (data: MapChunkSpawnEntityData) => {
      addChunkEntities({ ...data });
    };
    const despawnListener = (data: MapChunkDespawnEntityData) => {
      removeChunkEntities(data.payload.entityId, data.type);
    };
    const updateListener = () => {
      
    };

    socket.on(socketEvents.entitySpawn(), spawnListener);
    socket.on(socketEvents.entityDespawn(), despawnListener);
    socket.on(socketEvents.entityUpdate(), updateListener);

    return () => {
      socket.off(socketEvents.entitySpawn(), spawnListener);
      socket.off(socketEvents.entityDespawn(), despawnListener);
      socket.off(socketEvents.entityUpdate(), updateListener);
    };
  }, [addChunkEntities, id, removeChunkEntities, socket, updateHero]);
};

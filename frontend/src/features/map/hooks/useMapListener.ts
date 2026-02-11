import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { HeroOfflineData, HeroOnlineData, MapUpdateData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { useEffect } from 'react';

import { useMapHeroesUpdate } from './useMapHeroesUpdate';

export const useMapListener = () => {
  const { mapId } = useHero((data) => ({
    mapId: data?.location?.mapId ?? '',
  }));
  const { socket } = useSocket();
  const { deleteHeroes, addHeroes } = useMapHeroesUpdate(mapId);
  const { updateHero } = useHeroUpdate();
  const id = useHeroId();
 
  useEffect(() => {
    const listener = (data: MapUpdateData | HeroOfflineData | HeroOnlineData) => {
      switch (data.type) {
        case 'REMOVE_HERO':
          deleteHeroes(data.payload.heroId);
          break;
        case 'ADD_HERO':
          if (id === data.payload.hero.id) {
            updateHero({ state: 'IDLE', location: { placeId: null, mapId: data.payload.mapId } });
          }
          addHeroes(data.payload.hero);
          break;

        case 'HERO_OFFLINE':
          deleteHeroes(data.payload.heroId);
          break;
        case 'HERO_ONLINE': {
          addHeroes(data.payload);

          break;
        }
      }
    };
    socket.on(socketEvents.mapUpdate(), listener);

    return () => {
      socket.off(socketEvents.mapUpdate(), listener);
    };
  }, [addHeroes, deleteHeroes, id, socket, updateHero]);
};

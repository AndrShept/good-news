import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { HeroOfflineData, HeroOnlineData, HeroUpdateStateData, MapUpdateData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useEffect } from 'react';

import { useMapHeroesUpdate } from './useMapHeroesUpdate';

export const useMapListener = () => {
  const { mapId } = useHero((data) => ({
    mapId: data?.location?.mapId ?? '',
  }));
  const { socket } = useSocket();
  const { deleteHeroes, addHeroes ,updateHeroes} = useMapHeroesUpdate(mapId);
  const { updateHero } = useHeroUpdate();
  const id = useHeroId();

  useEffect(() => {
    const listener = (data: MapUpdateData | HeroOfflineData | HeroOnlineData | HeroUpdateStateData) => {
      switch (data.type) {
        case 'REMOVE_HERO':
          deleteHeroes(data.payload.heroId);
          break;
        case 'ADD_HERO':
          if (id === data.payload.hero.id) {
            updateHero({
              state: 'IDLE',
              location: { placeId: null, mapId: data.payload.mapId, x: data.payload.hero.x, y: data.payload.hero.y },
            });
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
        case 'UPDATE_STATE':
          if (data.payload.heroId === id) {
            updateHero({ state: data.payload.state });
          }
          updateHeroes(data.payload.heroId, { state: data.payload.state });
          break;
      }
    };
    socket.on(socketEvents.mapUpdate(), listener);

    return () => {
      socket.off(socketEvents.mapUpdate(), listener);
    };
  }, [addHeroes, deleteHeroes, id, socket, updateHero]);
};

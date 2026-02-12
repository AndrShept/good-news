import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { HeroOfflineData, HeroOnlineData, HeroUpdateStateData, PlaceUpdateData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useEffect } from 'react';

import { usePlaceHeroesUpdate } from './usePlaceHeroesUpdate';

export const usePlaceListener = () => {
  const placeId = useHero((data) => data?.location?.placeId ?? '');
  const id = useHeroId();
  const { socket } = useSocket();
  const { updateHero } = useHeroUpdate();
  const { addHeroes, removeHeroes, updateHeroes } = usePlaceHeroesUpdate(placeId);

  useEffect(() => {
    const listener = (data: PlaceUpdateData | HeroOfflineData | HeroOnlineData | HeroUpdateStateData) => {
      switch (data.type) {
        case 'REMOVE_HERO':
          removeHeroes(data.payload.heroId);
          break;

        case 'ADD_HERO':
          if (data.payload.hero.id === id) {
            updateHero({ state: 'IDLE', location: { placeId: data.payload.placeId, mapId: null } });
          }
          addHeroes(data.payload.hero);
          break;
        case 'HERO_OFFLINE':
          removeHeroes(data.payload.heroId);
          break;
        case 'HERO_ONLINE':
          addHeroes(data.payload);
          break;
        case 'UPDATE_STATE':
          if (data.payload.heroId === id) {
            updateHero({ state: data.payload.state });
          }
          updateHeroes(data.payload.heroId, { state: data.payload.state });
          break;
      }
    };
    socket.on(socketEvents.placeUpdate(), listener);

    return () => {
      socket.off(socketEvents.placeUpdate(), listener);
    };
  }, [addHeroes, id, removeHeroes, socket, updateHero, updateHeroes]);
};

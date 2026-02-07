import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { joinRoomClient } from '@/lib/utils';
import { HeroOfflineData, HeroOnlineData, HeroUpdateStateData, PlaceUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useGameMessages, useSetGameMessage } from '@/store/useGameMessages';
import { useEffect, useRef } from 'react';

import { usePlaceHeroesUpdate } from './usePlaceHeroesUpdate';

export const usePlaceListener = () => {
  const setGameMessage = useSetGameMessage();
  const placeId = useHero((data) => data?.location?.placeId ?? '');
  const id = useHeroId();
  const { socket } = useSocket();
  const { updateHero } = useHeroUpdate();
  const { addHeroes, removeHeroes, updateHeroes } = usePlaceHeroesUpdate(placeId);
  const prevTownIdRef = useRef<string | null>(null);

  useEffect(() => {
    joinRoomClient({
      id: placeId,
      prevRefId: prevTownIdRef,
      socket,
      setGameMessage,
      joinMessage: 'join town room',
      leaveMessage: 'leave town room',
    });
  }, [placeId, setGameMessage, socket]);
  useEffect(() => {
    const listener = (data: PlaceUpdateEvent | HeroOfflineData | HeroOnlineData | HeroUpdateStateData) => {
      switch (data.type) {
        case 'HERO_LEAVE_PLACE':
          if (data.payload.heroId === id) {
            setGameMessage({
              type: 'SUCCESS',
              text: `You have leave a town.`,
            });
            updateHero({ state: 'IDLE', location: { mapId: data.payload.mapId, placeId: null } });
          }
          removeHeroes(data.payload.heroId);
          break;

        case 'HERO_ENTER_PLACE':
          addHeroes(data.payload);
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
  }, [addHeroes, id, removeHeroes, setGameMessage, socket, updateHero]);
};

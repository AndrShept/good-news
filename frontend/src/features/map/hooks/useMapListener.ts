import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { joinRoomClient } from '@/lib/utils';
import { HeroOfflineData, HeroOnlineData, MapUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useGameMessages } from '@/store/useGameMessages';
import { useEffect, useRef } from 'react';

import { useMapHeroesUpdate } from './useMapHeroesUpdate';

export const useMapListener = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const mapId = useHero((data) => data?.location?.mapId ?? '');
  const id = useHeroId();
  const { socket } = useSocket();
  const { updateHero } = useHeroUpdate();
  const { updateHeroesPos, deleteHeroes, addHeroes } = useMapHeroesUpdate(mapId);
  const prevMapIdRef = useRef<string | null>(null);

  useEffect(() => {
    joinRoomClient({
      id: mapId,
      prevRefId: prevMapIdRef,
      socket,
      setGameMessage,
      joinMessage: 'join map room',
      leaveMessage: 'leave map room',
    });
  }, [mapId, setGameMessage, socket]);
  useEffect(() => {
    const listener = (data: MapUpdateEvent | HeroOfflineData | HeroOnlineData) => {
      switch (data.type) {
        case 'HERO_ENTER_PLACE':
          if (id === data.payload.heroId) {
            setGameMessage({
              type: 'SUCCESS',
              text: `You have entered a town.`,
            });
            updateHero({ state: 'IDLE', location: { mapId: null, placeId: data.payload.placeId } });
          }
          deleteHeroes(data.payload.heroId);
          break;
        case 'HERO_LEAVE_PLACE':
          if (id === data.payload.heroId) {
            console.log('');
          }
          addHeroes(data.payload.location);
          break;

        case 'WALK_MAP':
          if (id === data.payload.heroId) {
            setGameMessage({
              type: 'SUCCESS',
              text: `You have entered tile.`,
            });
            updateHero({ state: 'IDLE', location: { ...data.payload.newPosition } });
          }
          updateHeroesPos(data.payload.heroId, { ...data.payload.newPosition });
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
  }, [addHeroes, deleteHeroes, id, setGameMessage, socket, updateHero, updateHeroesPos]);
};

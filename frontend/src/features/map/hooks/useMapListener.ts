import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { joinRoomClient } from '@/lib/utils';
import { MapUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useGameMessages } from '@/store/useGameMessages';
import { useEffect, useRef } from 'react';

import { useMapHeroesUpdate } from './useMapHeroesUpdate';

export const useMapListener = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const mapId = useHero((state) => state?.data?.location?.mapId ?? '');
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
    const listener = (data: MapUpdateEvent) => {
      switch (data.type) {
        case 'HERO_ENTER_TOWN':
          if (id === data.payload.heroId) {
            setGameMessage({
              type: 'success',
              text: `You have entered a town.`,
            });
            updateHero({ action: { type: 'IDLE' }, location: { mapId: null, townId: data.payload.townId } });
          }
          deleteHeroes(data.payload.heroId);
          break;
        case 'HERO_LEAVE_TOWN':
          if (id === data.payload.heroId) {
          }
          addHeroes(data.payload.location);
          break;

        case 'WALK_MAP':
          if (id === data.payload.heroId) {
            setGameMessage({
              type: 'success',
              text: `You have entered tile.`,
            });
            updateHero({ action: { type: 'IDLE' }, location: { ...data.payload.newPosition } });
          }
          updateHeroesPos(data.payload.heroId, { ...data.payload.newPosition });
          break;
      }
    };
    socket.on(socketEvents.mapUpdate(), listener);

    return () => {
      socket.off(socketEvents.mapUpdate(), listener);
    };
  }, [addHeroes, deleteHeroes, id, setGameMessage, socket, updateHero, updateHeroesPos]);
};

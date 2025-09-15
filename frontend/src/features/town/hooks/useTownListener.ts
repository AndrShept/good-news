import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroChange } from '@/features/hero/hooks/useHeroChange';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { buildingName as building } from '@/features/town/components/TownBuilding';
import { joinRoomClient } from '@/lib/utils';
import { TownUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useGameMessages } from '@/store/useGameMessages';
import { useEffect, useRef } from 'react';

export const useTownListener = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const townId = useHero((state) => state?.data?.location?.townId ?? '');
  const id = useHeroId();
  const { socket } = useSocket();
  const { heroChange } = useHeroChange();
  const prevTownIdRef = useRef<string | null>(null);

  useEffect(() => {
    joinRoomClient({
      id: townId,
      prevRefId: prevTownIdRef,
      socket,
      setGameMessage,
      joinMessage: 'join town room',
      leaveMessage: 'leave town room',
    });
  }, [townId, socket]);
  useEffect(() => {
    const listener = (data: TownUpdateEvent) => {
      switch (data.type) {
        case 'HERO_LEAVE_TOWN':
          if (data.payload.heroId === id) {
            heroChange({
              location: {
                mapId: data.payload.mapId,
                townId: null,
                town: undefined,
                currentBuilding: undefined,
                type: 'MAP',
              },
              tile: data.payload.tile,
              tileId: data.payload.tileId,
            });
          }
            //filter heroes arr
          break;
        case 'WALK_TOWN':
          heroChange({
            action: {
              type: 'IDLE',
            },
            location: {
              currentBuilding: data.payload.buildingName,
            },
          });
          setGameMessage({
            type: 'success',
            text: `You have entered the ${building[data.payload.buildingName]}.`,
          });
          break;
  
      }
    };
    socket.on(socketEvents.townUpdate(), listener);

    return () => {
      socket.off(socketEvents.townUpdate(), listener);
    };
  }, [socket]);
};

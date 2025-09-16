import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroChange } from '@/features/hero/hooks/useHeroChange';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { joinRoomClient } from '@/lib/utils';
import { MapUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useGameMessages } from '@/store/useGameMessages';
import { useEffect, useRef } from 'react';

import { useChangeMap } from './useChangeMap';

export const useMapListener = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const mapId = useHero((state) => state?.data?.location?.mapId ?? '');
  const id = useHeroId();
  const { socket } = useSocket();
  const { heroChange } = useHeroChange();
  const { filterHeroes, addHeroes } = useChangeMap(mapId);
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
  }, [mapId, socket]);
  useEffect(() => {
    const listener = (data: MapUpdateEvent) => {
      switch (data.type) {
        case 'HERO_ENTER_TOWN':
          if (data.payload.heroId === id) {
            heroChange({
              location: {
                mapId: null,
                map: undefined,
                town: data.payload.town,
                townId: data.payload.townId,
                type: 'TOWN',
              },
              tile: undefined,
              tileId: null,
            });
          }
          filterHeroes({ heroId: data.payload.heroId, pos: data.payload.pos });
          break;
        case 'HERO_LEAVE_TOWN':
          addHeroes({ hero: data.payload.hero, pos: data.payload.pos });
          console.log('TYT');
          break;

        case 'WALK_MAP':
          if (id === data.payload.hero.id) {
            heroChange({
              action: {
                type: 'IDLE',
              },
              tile: data.payload.tile,
              tileId: data.payload.targetTileId,
            });
            setGameMessage({
              type: 'success',
              text: `You have entered tile.`,
            });
          }
          filterHeroes({ pos: { ...data.payload.currentTilePos }, heroId: data.payload.hero.id });
          addHeroes({ pos: { ...data.payload.targetTilePos }, hero: data.payload.hero });
          break;
      }
    };
    socket.on(socketEvents.mapUpdate(), listener);

    return () => {
      socket.off(socketEvents.mapUpdate(), listener);
    };
  }, [socket]);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { joinRoomClient } from '@/lib/utils';
import { MapUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useGameMessages } from '@/store/useGameMessages';
import { useEffect, useRef } from 'react';

import { useMapUpdate } from './useMapUpdate';

export const useMapListener = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const mapId = useHero((state) => state?.data?.location?.tile?.mapId ?? '');
  const id = useHeroId();
  const { socket } = useSocket();
  const { updateHero, updateHeroTile } = useHeroUpdate();
  const { updateMapTilePos } = useMapUpdate(mapId);
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
          break;
        case 'HERO_LEAVE_TOWN':
          break;

        case 'WALK_MAP':
          if (id === data.payload.heroId) {
            setGameMessage({
              type: 'success',
              text: `You have entered tile.`,
            });
            updateHeroTile({ ...data.payload.newPosition });
            updateHero({ action: { type: 'IDLE' } });
          }
          updateMapTilePos(data.payload.tileId, { ...data.payload.newPosition });
          break;
      }
    };
    socket.on(socketEvents.mapUpdate(), listener);

    return () => {
      socket.off(socketEvents.mapUpdate(), listener);
    };
  }, [id, setGameMessage, socket, updateHero, updateHeroTile, updateMapTilePos]);
};

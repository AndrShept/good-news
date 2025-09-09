import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroChange } from '@/features/hero/hooks/useHeroChange';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useChangeMap } from '@/features/map/hooks/useChangeMap';
import { SocketEnterTownResponse, SocketLeaveTownResponse } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { IGameMessage, useGameMessages } from '@/store/useGameMessages';
import { RefObject, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

type TJoinRoomParams = {
  socket: Socket;
  id: string;
  joinMessage?: string;
  leaveMessage?: string;
  prevRefId: RefObject<string | null>;
  setGameMessage: (message: IGameMessage) => void;
};

const joinRoom = ({ socket, id, joinMessage, leaveMessage, prevRefId, setGameMessage }: TJoinRoomParams) => {
  if (id) {
    socket.emit(socketEvents.joinRoom(), id, (cb: { accept: boolean }) => {
      if (cb.accept && joinMessage) {
        setGameMessage({
          text: `${joinMessage} ${id}`,
          type: 'info',
        });
      }
    });
    prevRefId.current = id;
  }
  if (prevRefId.current && !id) {
    socket.emit(socketEvents.leaveRoom(), prevRefId.current, (cb: { accept: boolean }) => {
      if (cb.accept && leaveMessage) {
        setGameMessage({
          text: `${leaveMessage} ${prevRefId.current}`,
          type: 'error',
        });
      }
    });
  }
};

export const useTownListener = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const townId = useHero((state) => state?.data?.location?.townId ?? '');
  const id = useHeroId();
  const { socket } = useSocket();
  const { heroChange } = useHeroChange();
  const prevTownIdRef = useRef<string | null>(null);

  useEffect(() => {
    joinRoom({
      id: townId,
      prevRefId: prevTownIdRef,
      socket,
      setGameMessage,
      joinMessage: 'join town room',
      leaveMessage: 'leave town room',
    });
  }, [townId, socket]);
  useEffect(() => {
    const listener = (data: SocketLeaveTownResponse) => {
      if (data.heroId === id) {
        heroChange({
          location: {
            mapId: data.mapId,
            townId: null,
            town: undefined,
          },
          tileId: data.tileId,
        });
      }
    };
    socket.on(socketEvents.leaveTown(), listener);

    return () => {
      socket.off(socketEvents.leaveTown(), listener);
    };
  }, [socket]);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { socketEvents } from '@/shared/socket-events';
import { IGameMessage, useGameMessages } from '@/store/useGameMessages';
import { useQueryClient } from '@tanstack/react-query';
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

export const useMapListener = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const mapId = useHero((state) => state?.data?.location?.mapId ?? '');
  const selfId = useHeroId();
  const { socket } = useSocket();

  const prevMapIdRef = useRef<string | null>(null);

  useEffect(() => {
    joinRoom({
      id: mapId,
      prevRefId: prevMapIdRef,
      socket,
      setGameMessage,
      joinMessage: 'join map room',
      leaveMessage: 'leave map room',
    });
  }, [mapId, socket]);
};

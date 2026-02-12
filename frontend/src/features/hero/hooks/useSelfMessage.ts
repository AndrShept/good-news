import { useSocket } from '@/components/providers/SocketProvider';
import { socketEvents } from '@/shared/socket-events';
import { GameSysMessage } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

export const useSelfMessage = () => {
  const { socket } = useSocket();
  const setGameMessage = useSetGameMessage();

  useEffect(() => {
    const listener = (data: GameSysMessage) => {
      setGameMessage({
        ...data,
      });
    };
    socket.on(socketEvents.selfMessage(), listener);
    return () => {
      socket.off(socketEvents.selfMessage(), listener);
    };
  }, [setGameMessage, socket]);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { SelfMessageData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

export const useSelfMessage = () => {
  const { socket } = useSocket();
  const setGameMessage = useSetGameMessage();

  useEffect(() => {
    const listener = (data: SelfMessageData) => {
      setGameMessage({
        text: data.message,
        type: data.type,
      });
    };
    socket.on(socketEvents.selfMessage(), listener);
    return () => {
      socket.off(socketEvents.selfMessage(), listener);
    };
  }, []);
};

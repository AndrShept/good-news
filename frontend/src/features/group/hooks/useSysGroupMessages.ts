import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { socketEvents } from '@/shared/socket-events';
import { useGameMessages } from '@/store/useGameMessages';
import { useEffect } from 'react';

export const useSysGroupMessages = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const groupId = useHero((state) => state?.data?.groupId ?? '');
  const { socket } = useSocket();

  useEffect(() => {
    socket.on(socketEvents.groupSysMessages(), (data) => {
      setGameMessage({
        text: 'LEAVE',
        type: 'info',
      });
    });
  }, [socket]);

  useEffect(() => {
    if (groupId) {
      socket.emit(socketEvents.joinRoom(), groupId, (cb: { accept: boolean }) => {
        if (cb.accept) {
          setGameMessage({
            text: 'join group room ',
            type: 'info',
          });
        }
      });
    }
  }, [groupId, socket]);
};

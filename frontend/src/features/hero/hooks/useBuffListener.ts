import { useSocket } from '@/components/providers/SocketProvider';
import { BuffAddData, BuffRemoveData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useEffect } from 'react';

import { useHeroUpdate } from './useHeroUpdate';

export const useBuffListener = () => {
  const { socket } = useSocket();
  const { addBuff, removeBuff, updateBuff, updateHero } = useHeroUpdate();
  useEffect(() => {
    const buffAddHandler = (data: BuffAddData) => {};
    const buffRemoveHandler = (data: BuffRemoveData) => {
      updateHero({ ...data.hero });
      removeBuff(data.buffInstanceId);
    };

    socket.on(socketEvents.buffAdd(), buffAddHandler);
    socket.on(socketEvents.buffRemove(), buffRemoveHandler);
    return () => {
      socket.off(socketEvents.buffAdd(), buffAddHandler);
      socket.off(socketEvents.buffRemove(), buffRemoveHandler);
    };
  }, [socket]);
};

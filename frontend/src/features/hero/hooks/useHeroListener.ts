import { useSocket } from '@/components/providers/SocketProvider';
import { SelfHeroData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getHeroOptions } from '../api/get-hero';
import { useBuff } from './useBuff';
import { useHeroId } from './useHeroId';

export const useHeroListener = () => {
  const { socket } = useSocket();
  const { removeBuff } = useBuff();
  const id = useHeroId();
  const queryClient = useQueryClient();
  useEffect(() => {
    const listener = async (data: SelfHeroData) => {
      switch (data.jobName) {
        case 'BUFF_CREATE':
          await queryClient.invalidateQueries({ queryKey: getHeroOptions().queryKey });
          removeBuff(data.payload.gameItemId);
          break;
      }
    };

    socket.on(socketEvents.dataSelf(), listener);

    return () => {
      socket.off(socketEvents.dataSelf(), listener);
    };
  }, [socket]);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { RemoveBuffData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getHeroOptions } from '../api/get-hero';
import { useBuff } from './useBuff';


export const useHeroListener = () => {
  const { socket } = useSocket();
  const { removeBuff } = useBuff();
  const queryClient = useQueryClient();
  useEffect(() => {
    const listener = async (data: RemoveBuffData) => {
      switch (data.type) {
        case 'REMOVE_BUFF':
          await queryClient.invalidateQueries({ queryKey: getHeroOptions().queryKey });
          removeBuff(data.payload.buffInstanceId);
          break;

      }
    };

    socket.on(socketEvents.selfData(), listener);

    return () => {
      socket.off(socketEvents.selfData(), listener);
    };
  }, []);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { SelfHeroData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getHeroOptions } from '../api/get-hero';
import { useBuff } from './useBuff';
import { useUpdateHero } from './useUpdateHero';

export const useHeroListener = () => {
  const { socket } = useSocket();
  const { removeBuff } = useBuff();
  const { updateHero } = useUpdateHero();
  const queryClient = useQueryClient();
  useEffect(() => {
    const listener = async (data: SelfHeroData) => {
      switch (data.jobName) {
        case 'BUFF_CREATE':
          await queryClient.invalidateQueries({ queryKey: getHeroOptions().queryKey });
          removeBuff(data.payload.gameItemId);
          break;
        case 'REGEN_HEALTH':
          updateHero({ currentHealth: data.payload.currentHealth });
          break;
        case 'REGEN_MANA':
          updateHero({ currentMana: data.payload.currentMana });
          break;
      }
    };

    socket.on(socketEvents.selfData(), listener);

    return () => {
      socket.off(socketEvents.selfData(), listener);
    };
  }, [socket]);
};

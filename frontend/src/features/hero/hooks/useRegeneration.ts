import { useSocket } from '@/components/providers/SocketProvider';
import { client } from '@/lib/utils';
import { RegenHealthJob } from '@/shared/job-types';
import { socketEvents } from '@/shared/socket-events';
import { ApiHeroResponse } from '@/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useHero } from './useHero';

export const useRegeneration = () => {
  const { currentHealth, currentMana, id, maxHealth, maxMana } = useHero((state) => ({
    currentHealth: state?.data?.currentHealth ?? 0,
    currentMana: state?.data?.currentMana ?? 0,
    maxHealth: state?.data?.maxHealth ?? 0,
    maxMana: state?.data?.maxMana ?? 0,
    id: state?.data?.id ?? '',
  }));
  const isFullHealth = currentHealth >= maxHealth;
  const isFullMana = currentMana >= maxMana;
  const { socket } = useSocket();
  const mutationHealth = useMutation({
    mutationFn: async () => {
      const res = await client.hero[':id'].regeneration.health.$post({
        param: { id },
      });
    },
  });
  useEffect(() => {
    if (!isFullHealth) {
      mutationHealth.mutate();
    }
  }, [isFullHealth]);
  useEffect(() => {
    const listener = (data: RegenHealthJob) => {
      console.log(data.payload.currentHealth);
    };
    socket.on(socketEvents.dataSelf(), listener);

    return () => {
      socket.off(socketEvents.dataSelf(), listener);
    };
  }, [socket]);
};

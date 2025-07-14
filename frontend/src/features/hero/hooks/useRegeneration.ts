import { useSocket } from '@/components/providers/SocketProvider';
import { ApiHeroResponse } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useHero } from './useHero';

export const useRegeneration = () => {
  const { currentHealth, currentMana, id, maxHealth, maxMana } = useHero((state) => ({
    currentHealth: state?.data?.currentHealth ?? 0,
    currentMana: state?.data?.currentMana ?? 0,
    maxHealth: state?.data?.maxHealth ?? 0,
    maxMana: state?.data?.maxMana ?? 0,
    id: state?.data?.id,
  }));
  const isFullHealth = currentHealth >= maxHealth;
  const isFullMana = currentMana >= maxMana;
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    const listener = (data: { currentHealth: number } | { currentMana: number }) => {
      queryClient.setQueryData<ApiHeroResponse>(['hero'], (oldData) => {
        if (!oldData || !oldData.data) return;

        return { ...oldData, data: { ...oldData.data, ...data } };
      });
    };

    if (!isFullHealth) {
      socket.emit('go-health', id);
      socket.on(`health-regeneration-${id}`, listener);
    }
    if (!isFullMana) {
      socket.emit('go-mana', id);
      socket.on(`mana-regeneration-${id}`, listener);
    }
    return () => {
      socket.off(`health-regeneration`, listener);
      socket.off(`mana-regeneration-${id}`, listener);
    };
  }, [id, isFullHealth, isFullMana, socket]);
};

import { client } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useHero } from './useHero';

export const useRegeneration = () => {
  const { currentHealth, currentMana, id, maxHealth, maxMana, stat, modifier } = useHero((state) => ({
    currentHealth: state?.data?.currentHealth ?? 0,
    currentMana: state?.data?.currentMana ?? 0,
    maxHealth: state?.data?.maxHealth ?? 0,
    maxMana: state?.data?.maxMana ?? 0,
    id: state?.data?.id ?? '',
    stat: state?.data?.stat,
    modifier: state?.data?.modifier,
  }));
  const isFullHealth = currentHealth >= maxHealth;
  const isFullMana = currentMana >= maxMana;

  const mutationHealth = useMutation({
    mutationFn: async () => {
      client.hero[':id'].regeneration.health.$post({
        param: { id },
      });
    },
  });
  const mutationMana = useMutation({
    mutationFn: async () => {
      client.hero[':id'].regeneration.mana.$post({
        param: { id },
      });
    },
  });
  useEffect(() => {
    if (
      (!isFullHealth && !mutationHealth.isPending) ||
      (!isFullHealth && !mutationHealth.isPending && (stat?.constitution || modifier?.constitution))
    ) {
      mutationHealth.mutate();
    }
  }, [isFullHealth, modifier?.constitution, stat?.constitution]);

  useEffect(() => {
    if (
      (!isFullMana && !mutationMana.isPending) ||
      (!isFullMana && !mutationMana.isPending && (stat?.intelligence || modifier?.intelligence))
    ) {
      mutationMana.mutate();
    }
  }, [isFullMana, modifier?.intelligence, stat?.intelligence]);
};

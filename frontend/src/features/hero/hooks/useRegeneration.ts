import { useEffect } from 'react';

import { useHero } from './useHero';

export const useRegeneration = () => {
  const { currentHealth, currentMana, id, maxHealth, maxMana, stat, modifier } = useHero((data) => ({
    currentHealth: data?.currentHealth ?? 0,
    currentMana: data?.currentMana ?? 0,
    maxHealth: data?.maxHealth ?? 0,
    maxMana: data?.maxMana ?? 0,
    id: data?.id ?? '',
    stat: data?.stat,
    modifier: data?.modifier,
  }));
  const isFullHealth = currentHealth >= maxHealth;
  const isFullMana = currentMana >= maxMana;

  // useEffect(() => {
  //   if (!isFullHealth) {
  //   }
  // }, [isFullHealth, modifier?.constitution, stat?.constitution]);

  // useEffect(() => {
  //   if (!isFullMana) {
  //   }
  // }, [isFullMana, modifier?.wisdom, stat?.wisdom]);
};

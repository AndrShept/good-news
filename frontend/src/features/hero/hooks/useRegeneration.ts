import { useEffect } from 'react';

import { useHero } from './useHero';
import { useHeroUpdate } from './useHeroUpdate';

export const useRegeneration = () => {
  const { currentHealth, currentMana, maxHealth, maxMana, regen, state } = useHero((data) => ({
    currentHealth: data?.currentHealth ?? 0,
    currentMana: data?.currentMana ?? 0,
    maxHealth: data?.maxHealth ?? 0,
    maxMana: data?.maxMana ?? 0,
    regen: data?.regen,
    state: data?.state

  }));
  const { updateHero } = useHeroUpdate()
  const isFullHealth = currentHealth >= maxHealth;
  const isFullMana = currentMana >= maxMana;


  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!isFullHealth && state !== 'BATTLE') {
      timer = setInterval(() => {

        updateHero({ currentHealth: currentHealth + 1 })
      }, regen?.healthTimeMs)

    }
    return () => {
      clearInterval(timer)
    }
  }, [isFullHealth, currentHealth, regen?.healthTimeMs, state]);
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (!isFullMana && state !== 'BATTLE') {
      timer = setInterval(() => {

        updateHero({ currentMana: currentMana + 1 })
      }, regen?.manaTimeMs)

    }
    return () => {
      clearInterval(timer)
    }
  }, [isFullMana, currentMana, regen?.manaTimeMs, state]);


};

import { HeroStats } from '@/shared/types';
import { Dispatch, SetStateAction } from 'react';

import { Stat } from '../components/Stats';

interface Props {
  setCurrentStats: Dispatch<SetStateAction<HeroStats>>;
  currentStats: HeroStats;
  setFreePoints: Dispatch<SetStateAction<number>>;
  baseStats: HeroStats;
  freePoints: number;
}

export const useChangeHeroStats = ({ currentStats, setCurrentStats, setFreePoints, baseStats, freePoints }: Props) => {
  const getStatPriority = (stat: keyof HeroStats) => {
    const priority: Record<keyof HeroStats, number> = {
      strength: 1,
      dexterity: 2,
      intelligence: 3,
      constitution: 4,
      luck: 5,
    };
    return priority[stat];
  };
  const initialStats = Object.entries(currentStats).map(([key, value]) => ({
    name: key as keyof HeroStats,
    value,
    sort: getStatPriority(key as keyof HeroStats),
  }));
  const onIncrement = (data: Stat) => {
    setCurrentStats((prev) => {
      setFreePoints(freePoints - 1);
      return { ...prev, [data.name]: prev[data.name] + 1 };
    });
  };

  const onDecrement = (data: Stat) => {
    setCurrentStats((prev) => {
      if (prev[data.name] >= baseStats[data.name]) {
        setFreePoints(freePoints + 1);
        return { ...prev, [data.name]: prev[data.name] - 1 };
      }
      return prev;
    });
  };
  return {
    initialStats,
    onIncrement,
    onDecrement,
  };
};

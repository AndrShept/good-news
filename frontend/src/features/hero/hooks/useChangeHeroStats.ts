import { HeroStats } from '@/shared/types';
import { Dispatch, SetStateAction } from 'react';

import { Stat } from '../components/Stats';

interface Props {
  setCurrentStats: Dispatch<SetStateAction<HeroStats>>;
  currentStats: HeroStats;
  setFreePoints: Dispatch<SetStateAction<number>>;
  baseStats: HeroStats;
}

export const useChangeHeroStats = ({ currentStats, setCurrentStats, setFreePoints, baseStats }: Props) => {
  const initialStats = Object.entries(currentStats).map(([key, value]) => ({
    name: key as keyof HeroStats,
    value,
  }));
  const onIncrement = (data: Stat) => {
    setCurrentStats((prev) => {
      setFreePoints((prev) => {
        return prev - 1;
      });
      return { ...prev, [data.name]: prev[data.name] + 1 };
    });
  };

  const onDecrement = (data: Stat) => {
    setCurrentStats((prev) => {
      if (prev[data.name] >= baseStats[data.name]) {
        setFreePoints((prev) => prev + 1);
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

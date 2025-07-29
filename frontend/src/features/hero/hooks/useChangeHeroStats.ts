import { ConstitutionIcon } from '@/components/game-icons/ConstitutionIcon';
import { DexterityIcon } from '@/components/game-icons/DexterityIcon';
import { IntelligenceIcon } from '@/components/game-icons/IntelligenceIcon';
import { LuckIcon } from '@/components/game-icons/LuckIcon';
import { StrengthIcon } from '@/components/game-icons/StrengthIcon';
import { HeroStats } from '@/shared/types';
import { ComponentProps, ComponentType, Dispatch, FC, SetStateAction } from 'react';

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

  const statIcon: Record<keyof HeroStats, ComponentType<ComponentProps<'div'>>> = {
    strength: StrengthIcon,
    constitution: ConstitutionIcon,
    dexterity: DexterityIcon,
    intelligence: IntelligenceIcon,
    luck: LuckIcon,
  };
  const initialStats = Object.entries(currentStats).map(([key, value]) => ({
    name: key as keyof HeroStats,
    value,
    icon: statIcon[key as keyof HeroStats],
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

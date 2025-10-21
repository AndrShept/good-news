import { ConstitutionIcon } from '@/components/game-icons/ConstitutionIcon';
import { DexterityIcon } from '@/components/game-icons/DexterityIcon';
import { IntelligenceIcon } from '@/components/game-icons/IntelligenceIcon';
import { LuckIcon } from '@/components/game-icons/LuckIcon';
import { StrengthIcon } from '@/components/game-icons/StrengthIcon';
import { IHeroStat } from '@/shared/types';
import { ComponentProps, ComponentType, Dispatch, FC, SetStateAction, useCallback } from 'react';

import { Stat } from '../components/Stats';

interface Props {
  setCurrentStats: Dispatch<SetStateAction<IHeroStat>>;
  currentStats: IHeroStat;
  setFreePoints: Dispatch<SetStateAction<number>>;
  baseStats: IHeroStat;
  freePoints: number;
}

export const statIcon: Record<keyof IHeroStat, ComponentType<ComponentProps<'div'>>> = {
  strength: StrengthIcon,
  constitution: ConstitutionIcon,
  dexterity: DexterityIcon,
  intelligence: IntelligenceIcon,
  luck: LuckIcon,
};
export const useChangeHeroStats = ({ currentStats, setCurrentStats, setFreePoints, baseStats, freePoints }: Props) => {
  const getStatPriority = (stat: keyof IHeroStat) => {
    const priority: Record<keyof IHeroStat, number> = {
      strength: 1,
      dexterity: 2,
      intelligence: 3,
      constitution: 4,
      luck: 5,
    };
    return priority[stat];
  };
  const initialStats = Object.entries(currentStats).map(([key, value]) => ({
    name: key as keyof IHeroStat,
    value,
    icon: statIcon[key as keyof IHeroStat],
    sort: getStatPriority(key as keyof IHeroStat),
  }));
  const onIncrement = useCallback(
    (data: Stat) => {
      setCurrentStats((prev) => {
        setFreePoints(freePoints - 1);
        return { ...prev, [data.name]: prev[data.name] + 1 };
      });
    },
    [freePoints, setCurrentStats, setFreePoints],
  );

  const onDecrement = useCallback(
    (data: Stat) => {
      setCurrentStats((prev) => {
        if (prev[data.name] >= baseStats[data.name]) {
          setFreePoints(freePoints + 1);
          return { ...prev, [data.name]: prev[data.name] - 1 };
        }
        return prev;
      });
    },
    [baseStats, freePoints, setCurrentStats, setFreePoints],
  );
  return {
    initialStats,
    onIncrement,
    onDecrement,
  };
};

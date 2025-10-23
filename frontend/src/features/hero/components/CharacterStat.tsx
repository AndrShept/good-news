import { useHero } from '@/features/hero/hooks/useHero';
import { IHeroStat, Modifier } from '@/shared/types';
import { memo, useEffect, useRef, useState } from 'react';

import { Stats } from './Stats';

interface Props {
  freeStatPoints: number;
  modifier: Modifier | undefined;
  heroStat: IHeroStat | undefined;
}

export const CharacterStat = ({ freeStatPoints, modifier, heroStat }: Props) => {
  if (!modifier) throw new Error('modifier not found');
  if (!heroStat) throw new Error('stat not found');
  const initialHeroStats = {
    strength: 0,
    constitution: 0,
    dexterity: 0,
    intelligence: 0,
    luck: 0,
  };
  const [stats, setStats] = useState<IHeroStat>(initialHeroStats);
  const baseStats = useRef<IHeroStat>(initialHeroStats);
  const [freePoints, setFreePoints] = useState(freeStatPoints);
  const baseFreePoints = useRef(freeStatPoints);

  useEffect(() => {
    setStats(heroStat);
    console.log(heroStat);
    baseStats.current = heroStat;
    setFreePoints(freeStatPoints);
    baseFreePoints.current = freeStatPoints;
  }, [freeStatPoints, heroStat, modifier.constitution, modifier.dexterity, modifier.intelligence, modifier.luck, modifier.strength]);
  return (
    <>
      <Stats
        reset={true}
        currentStats={stats}
        setCurrentStats={setStats}
        freePoints={freePoints}
        setFreePoints={setFreePoints}
        baseStats={baseStats.current}
        baseFreePoints={baseFreePoints.current}
        modifier={modifier}
      />
    </>
  );
};

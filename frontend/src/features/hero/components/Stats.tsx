import { HeroStats } from '@/shared/types';
import { CheckIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

import { Button } from '../../../components/ui/button';
import { useChangeHeroStats } from '../hooks/useChangeHeroStats';
import { ResetStatsButton } from './ResetStatsButton';

export interface Stat {
  name: keyof HeroStats;
  value: number;
}

interface Props {
  reset: boolean;
  setCurrentStats: Dispatch<SetStateAction<HeroStats>>;
  currentStats: HeroStats;
  freePoints: number;
  setFreePoints: Dispatch<SetStateAction<number>>;
  baseStats: HeroStats;
  baseFreePoints?: number;
}

export const Stats = ({ reset, setCurrentStats, currentStats, freePoints, setFreePoints, baseStats, baseFreePoints }: Props) => {
  const { initialStats, onDecrement, onIncrement } = useChangeHeroStats({
    baseStats,
    currentStats,
    setCurrentStats,
    setFreePoints,
  });
  return (
    <section className="bg-secondary rounded border p-4">
      <ul className="flex flex-col gap-0.5">
        {initialStats.map((stat, idx) => (
          <li className="flex items-center justify-between" key={idx}>
            <p>{stat.name}</p>

            <div className="flex items-center gap-0.5">
              {!reset && (
                <Button
                  onClick={() => onDecrement(stat)}
                  disabled={stat.value === baseStats[stat.name]}
                  type="button"
                  className="size-6 p-0.5"
                  variant={'ghost'}
                  size={'icon'}
                >
                  -
                </Button>
              )}
              <p className={stat.value > baseStats[stat.name] ? 'text-yellow-400' : ''}>{stat.value}</p>
              {!reset && (
                <Button
                  onClick={() => onIncrement(stat)}
                  disabled={freePoints === 0}
                  type="button"
                  className="size-6 p-0.5"
                  variant={'ghost'}
                  size={'icon'}
                >
                  +
                </Button>
              )}
            </div>
          </li>
        ))}
        <div className="mt-2 flex justify-between">
          <p className="font-semibold text-green-400">Free points</p>
          <p className="">{freePoints}</p>
        </div>
        {(baseFreePoints ?? 0) > freePoints && (
          <Button className="mt-2 w-full text-green-500" variant={'outline'} size={'icon'}>
            <p>confirm</p> <CheckIcon className="size-4" />
          </Button>
        )}
        <ResetStatsButton />
      </ul>
    </section>
  );
};

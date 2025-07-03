import { useHero } from '@/features/hero/hooks/useHero';
import { HeroStats } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import { Dispatch, SetStateAction, memo } from 'react';

import { Button } from '../../../components/ui/button';
import { getHeroOptions } from '../api/get-hero';
import { useChangeHeroStats } from '../hooks/useChangeHeroStats';
import { useConfirmStats } from '../hooks/useConfirmStats';
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

export const Stats = ({ reset, setCurrentStats, currentStats, freePoints, setFreePoints, baseStats }: Props) => {
  const { initialStats, onDecrement, onIncrement } = useChangeHeroStats({
    baseStats,
    currentStats,
    setCurrentStats,
    setFreePoints,
    freePoints,
  });

  const { data: hero } = useQuery(getHeroOptions());
  const { mutate, isPending } = useConfirmStats(hero?.data?.id ?? '', { ...currentStats, freeStatPoints: freePoints });
  const onConfirm = async () => {
    mutate();
  };
  const areStatsEqual = (a: HeroStats, b: HeroStats) => {
    return Object.keys(a).every((key) => a[key as keyof HeroStats] === b[key as keyof HeroStats]);
  };
  return (
    <section className="bg-secondary rounded border p-4">
      <ul className="flex flex-col gap-0.5">
        {initialStats
          .sort((a, b) => a.sort - b.sort)
          .map((stat, idx) => (
            <li className="flex items-center justify-between" key={idx}>
              <p>{stat.name}</p>

              <div className="flex items-center gap-0.5">
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

                <p className={stat.value > baseStats[stat.name] ? 'text-yellow-400' : ''}>{stat.value}</p>

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
              </div>
            </li>
          ))}
        <div className="mt-2 flex justify-between">
          <p className="font-semibold text-green-400">Free points</p>
          <p className="">{freePoints}</p>
        </div>
        {!areStatsEqual(baseStats, currentStats) && reset && (
          <Button onClick={onConfirm} disabled={isPending} className="mt-2 w-full" variant={'outline'} size={'icon'}>
            <p>Confirm</p> <CheckIcon className="size-4 text-green-500" />
          </Button>
        )}
        {reset && <ResetStatsButton />}
      </ul>
    </section>
  );
}

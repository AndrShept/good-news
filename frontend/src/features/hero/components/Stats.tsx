import { IHeroStat } from '@/shared/types';
import { CheckIcon } from 'lucide-react';
import { Dispatch, SetStateAction, memo } from 'react';

import { Button } from '../../../components/ui/button';
import { useChangeHeroStats } from '../hooks/useChangeHeroStats';
import { useConfirmStats } from '../hooks/useConfirmStats';
import { ResetStatsButton } from './ResetStatsButton';

export interface Stat {
  name: keyof IHeroStat;
  value: number;
}

interface Props {
  reset: boolean;
  setCurrentStats: Dispatch<SetStateAction<IHeroStat>>;
  currentStats: IHeroStat;
  freePoints: number;
  setFreePoints: Dispatch<SetStateAction<number>>;
  baseStats: IHeroStat;
  baseFreePoints?: number;
}

export const Stats = memo(({ reset, setCurrentStats, currentStats, freePoints, setFreePoints, baseStats }: Props) => {
  const { initialStats, onDecrement, onIncrement } = useChangeHeroStats({
    baseStats,
    currentStats,
    setCurrentStats,
    setFreePoints,
    freePoints,
  });

  const { mutate, isPending } = useConfirmStats({ ...currentStats, freeStatPoints: freePoints });
  const onConfirm = async () => {
    mutate();
  };
  const areStatsEqual = (a: IHeroStat, b: IHeroStat) => {
    return Object.keys(a).every((key) => a[key as keyof IHeroStat] === b[key as keyof IHeroStat]);
  };
  return (
    <section className="bg-secondary rounded border p-4">
      <ul className="flex flex-col gap-0.5">
        {initialStats
          .sort((a, b) => a.sort - b.sort)
          .map((stat, idx) => (
            <li className="flex items-center justify-between" key={idx}>
              <div className="flex items-center gap-1.5">
                <stat.icon className="size-4.5" />
                <p>{stat.name}</p>
              </div>

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
});

import { BASE_STATS } from '@/shared/constants';
import { Dispatch, SetStateAction, useState } from 'react';

import { Button } from './ui/button';

export interface Stat {
  name: string;
  value: number;
}

interface Props {
  reset: boolean;
  setStats: Dispatch<SetStateAction<Stat[]>>;
  stats: Stat[];
  freePoints: number;
  setFreePoints: Dispatch<SetStateAction<number>>;
}

export const HeroStat = ({ reset, setStats, stats, freePoints, setFreePoints }: Props) => {
  const onIncrement = (data: Stat) => {
    setStats((prev) => {
      const updatedStats = prev.map((stat) => {
        if (stat.name === data.name) {
          return { ...stat, value: stat.value + 1 };
        }
        return stat;
      });

      setFreePoints((prev) => {
        return prev - 1;
      });
      return updatedStats;
    });
  };
  const onDecrement = (data: Stat) => {
    setStats((prev) => {
      const updatedStats = prev.map((stat) => {
        if (stat.name === data.name && stat.value > BASE_STATS[stat.name as keyof typeof BASE_STATS]) {
          setFreePoints((prev) => prev + 1);
          return { ...stat, value: stat.value - 1 };
        }
        return stat;
      });

      return updatedStats;
    });
  };
  return (
    <section className="bg-secondary rounded border p-4">

      <ul className="flex flex-col gap-0.5">
        {stats.map((stat, idx) => (
          <li className="flex items-center justify-between" key={idx}>
            <p>{stat.name}</p>

            <div className="flex items-center gap-0.5">
              {!reset && (
                <Button
                  onClick={() => onDecrement(stat)}
                  disabled={stat.value === BASE_STATS[stat.name as keyof typeof BASE_STATS]}
                  type="button"
                  className="size-6 p-0.5"
                  variant={'ghost'}
                  size={'icon'}
                >
                  -
                </Button>
              )}
              <p className={stat.value > BASE_STATS[stat.name as keyof typeof BASE_STATS] ? 'text-yellow-400' : ''}>{stat.value}</p>
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
      </ul>
    </section>
  );
};

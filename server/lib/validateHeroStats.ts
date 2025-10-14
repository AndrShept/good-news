import { BASE_FREE_POINTS, BASE_STATS } from '@/shared/constants';
import type { IHeroStat } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

interface ICheckStatSum {
  stat: IHeroStat;
  freeStatPoints: number;
  level: number
}

export const validateHeroStats = ({ stat, freeStatPoints, level }: ICheckStatSum) => {
  const base = Object.values(BASE_STATS).reduce((acc, item) => acc + item, 0);
  const totalStats = Object.values(stat).reduce((acc, item) => acc + item, 0);

  if (totalStats - base > BASE_FREE_POINTS * level) {
    throw new HTTPException(403, {
      message: 'You tried to assign more stat points than allowed. The balance gods have stopped you.',
    });
  }
  if (freeStatPoints > BASE_FREE_POINTS) {
    throw new HTTPException(403, {
      message: 'Invalid number of free points. Cheating attempt detected.',
    });
  }
};

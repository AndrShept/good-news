import { cn, formatDurationFromSeconds } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface Props {
  roundEndsAt: number;
  lowTime: number;
}
export const BattleTimer = ({ roundEndsAt, lowTime }: Props) => {
  const [timer, setTimer] = useState(() => Date.now());

  useEffect(() => {
    const timeId = setInterval(() => {
      setTimer(Date.now());
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);
  return (
    <p
      className={cn('text-foreground font-semibold', {
        'text-rose-600': Math.floor((roundEndsAt - timer) / 1000) <= lowTime,
      })}
    >
      {formatDurationFromSeconds(roundEndsAt - timer)}
    </p>
  );
};

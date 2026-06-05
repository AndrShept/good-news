import { formatDurationFromSeconds } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface Props {
  expiredAt: number;
}

export const TimerText = ({ expiredAt }: Props) => {
  const [timeLeft, setTimeLest] = useState(expiredAt - Date.now());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLest(expiredAt - Date.now());
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [expiredAt]);
  return <p className={timeLeft > 300_000 ? 'text-amber-300' : 'text-red-600'}>{formatDurationFromSeconds(timeLeft)}</p>;
};

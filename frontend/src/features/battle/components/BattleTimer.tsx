import { formatDurationFromSeconds } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface Props {
  roundEndsAt: number;
}
export const BattleTimer = ({ roundEndsAt }: Props) => {
  const [timer, setTimer] = useState(() => Date.now());

  useEffect(() => {
    const timeId = setInterval(() => {
      setTimer(Date.now());
    }, 1000);
    return () => {
      clearInterval(timeId);
    };
  }, []);

  return <>{formatDurationFromSeconds(roundEndsAt - timer)}</>;
};

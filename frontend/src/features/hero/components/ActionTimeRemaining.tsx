import { TimerBar } from '@/components/TimerBar';
import { WalkIcon } from '@/components/game-icons/WalkIcon';
import { useMotionValue, useTime, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import React, { useEffect, useState } from 'react';

import { useHero } from '../hooks/useHero';

export const ActionTimeRemaining = () => {
  const action = useHero((state) => state?.data?.action);
  const [seconds, setSeconds] = useState(0);
  const time = useTime();
  const totalTime = action?.timeRemaining ?? 0;
  const [startTime, setStartTime] = useState(performance.now());
  const width = useTransform(time, [startTime, startTime + totalTime * 1000], ['100%', '0%']);
  useEffect(() => {
    setSeconds(Math.max(action?.timeRemaining ?? 0, 0));
    setStartTime(performance.now());
    const timerId = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(timerId);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [action]);

  if (!seconds) return;
  return (
    <section className="max-w-70  top-0 mx-auto my-2 flex w-full items-center justify-center">
      <WalkIcon  className='size-12 shrink-0' />
      <div className="border-background relative flex ring-accent h-8 w-full overflow-hidden rounded border-2 ring-1">
        <m.div
          className="bg-accent  size-full overflow-hidden"
          style={{
            //   width: `${(seconds / totalTime) * 100}%`,
            width,
          }}
        />
        <div className="absolute left-0 top-0 flex size-full items-center justify-center">
          <p className="">{seconds}</p>
        </div>
      </div>
    </section>
  );
};

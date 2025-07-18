import { cn } from '@/lib/utils';
import { useTime, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'section'> {
  second?: number;
}

export const TimerBar = ({ second = 5000, className, ...props }: Props) => {
  const time = useTime();
  const width = useTransform(time, [0, second], ['100%', '0%']);
  return (
    <section {...props} className={cn('h-3 w-full overflow-hidden rounded-xl border', className)}>
      <m.div style={{ width }} className="size-full bg-amber-400" />
    </section>
  );
};

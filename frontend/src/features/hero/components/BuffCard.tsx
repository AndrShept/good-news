import { CustomTooltip } from '@/components/CustomTooltip';
import { ModifierInfoCard } from '@/components/ModifierInfoCard';
import { cn, formatDurationFromSeconds } from '@/lib/utils';
import { Buff } from '@/shared/types';
import { memo, useEffect, useState } from 'react';

type Props = Buff;

export const BuffCard = (props: Props) => {
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    setTime((new Date(props.completedAt).getTime() - Date.now()) / 60000);
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 60000);

    return () => clearInterval(timer);
  }, [props.completedAt]);

  return (
    <article>
      <CustomTooltip>
        <CustomTooltip.Trigger>
          <div className="hover:border-primary/20 relative flex justify-center rounded border">
            <img
              src={props.image}
              alt={props.name}
              style={{ imageRendering: 'pixelated' }}
              className={cn('hover:saturate-110 size-8 rounded-md opacity-90 hover:opacity-100', time < 2 && 'animate-pulse')}
            />
            <p className="absolute top-6 z-10 cursor-default text-xs">{time.toFixed(0)}m</p>

          </div>
        </CustomTooltip.Trigger>
        <CustomTooltip.Content>
          <div className="flex flex-col gap-2 border p-3">
            <div>
              <h3 className="line-clamp-2 text-[15px] font-semibold">{props.name.charAt(0).toUpperCase() + props.name.slice(1)}</h3>
              <p className="text-muted-foreground/30 text-xs">{props.type}</p>
            </div>
            <ModifierInfoCard modifier={props.modifier} />
            <p className="text-muted-foreground/30 text-xs">Expires in: {time.toFixed(0)} minutes</p>
          </div>
        </CustomTooltip.Content>
      </CustomTooltip>
    </article>
  );
}

import { CustomTooltip } from '@/components/CustomTooltip';
import { ModifierInfoCard } from '@/components/ModifierInfoCard';
import { cn, formatDurationFromSeconds } from '@/lib/utils';
import { Buff } from '@/shared/types';
import { useEffect, useState } from 'react';

interface Props {
  buff: Buff;
}

export const BuffCard = ({ buff }: Props) => {
  const [time, setTime] = useState((new Date(buff.completedAt).getTime() - Date.now()) / 60000);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <article>
      <CustomTooltip>
        <CustomTooltip.Trigger>
          <div className="relative flex justify-center rounded border hover:border-primary/20">
            <img
              src={buff.image}
              alt={buff.name}
              style={{imageRendering: 'pixelated'}}
              className={cn('size-8 rounded-md opacity-90 hover:opacity-100 hover:saturate-110 ', time < 2 && 'animate-pulse')}
            />
            <p className="absolute top-6 z-10 cursor-default text-xs">{time.toFixed(0)}m</p>
          </div>
        </CustomTooltip.Trigger>
        <CustomTooltip.Content>
          <div className="flex flex-col gap-2 border p-3">
            <div>
              <h3 className="line-clamp-2 text-[15px] font-semibold">{buff.name.charAt(0).toUpperCase() + buff.name.slice(1)}</h3>
              <p className="text-muted-foreground/30 text-xs">{buff.type}</p>
            </div>
            <ModifierInfoCard modifier={buff.modifier} />
            <p className="text-muted-foreground/30 text-xs">Expires in: {time.toFixed(0)} minutes</p>
          </div>
        </CustomTooltip.Content>
      </CustomTooltip>
    </article>
  );
};

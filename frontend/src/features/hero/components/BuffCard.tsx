import { CustomTooltip } from '@/components/CustomTooltip';
import { ModifierInfoCard } from '@/features/item-instance/components/ModifierInfoCard';
import { cn, formatDurationFromSeconds, getModifiers } from '@/lib/utils';
import { BuffInstance, BuffTemplate } from '@/shared/types';
import { memo, useEffect, useState } from 'react';

type Props = BuffInstance & {
  buffTemplate: BuffTemplate;
};

export const BuffCard = memo(function BuffCard(props: Props) {
  const [time, setTime] = useState(Date.now());
  const modifier = getModifiers(props.buffTemplate.modifier);
  useEffect(() => {
    setTime((props.expiresAt - Date.now()) / 60000);
  }, [props.expiresAt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((props.expiresAt - Date.now()) / 60000);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <article>
      <CustomTooltip>
        <CustomTooltip.Trigger>
          <div className="hover:border-primary/20 relative flex justify-center rounded border">
            <img
              src={props.buffTemplate.image}
              alt={props.buffTemplate.name}
              style={{ imageRendering: 'pixelated' }}
              className={cn('hover:saturate-110 size-8 rounded-md opacity-90 hover:opacity-100', time < 2 && 'animate-pulse')}
            />
            <p className="absolute top-6 z-10 cursor-default text-xs">{time.toFixed(0)}m</p>
          </div>
        </CustomTooltip.Trigger>
        <CustomTooltip.Content>
          <div className="flex flex-col gap-2 border p-3">
            <div>
              <h3 className="line-clamp-2 text-[15px] font-semibold">
                {props.buffTemplate.name.charAt(0).toUpperCase() + props.buffTemplate.name.slice(1)}
              </h3>
              <p className="text-muted-foreground/30 text-xs">{props.buffTemplate.type}</p>
            </div>
            <ModifierInfoCard modifiers={modifier} />
            <p className="text-muted-foreground/30 text-xs">Expires in: {time.toFixed(0)} minutes</p>
          </div>
        </CustomTooltip.Content>
      </CustomTooltip>
    </article>
  );
})

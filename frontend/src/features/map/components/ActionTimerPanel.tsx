import { GameIcon } from '@/components/GameIcon';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { Button } from '@/components/ui/button';
import { cn, formatDurationFromSeconds } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { StateType } from '@/shared/types';
import { ComponentProps, useEffect, useState } from 'react';

interface Props extends ComponentProps<'section'> {
  heroState: StateType;
  actionFinishAt: number;
  cancelActionMutation: () => void;
  cancelIsPending: boolean;
}

export const ActionTimerPanel = ({ heroState, actionFinishAt, cancelActionMutation, cancelIsPending, className, ...props }: Props) => {
  const [now, setNow] = useState(() => Date.now());
  const resultTime = Math.max(Math.ceil(actionFinishAt - now), 0);
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <section
      className={cn(
        className,
        ' flex h-fit w-fit  items-center gap-3  px-4 py-2 text-sm ',
      )}
    >
      <AnimatedShinyText className="flex items-center gap-2">
        <GameIcon className="size-5" image={imageConfig.icon.state[heroState]} />
        <span>{heroState.toLowerCase()}...</span>
      </AnimatedShinyText>
      <p className="">{formatDurationFromSeconds(resultTime)}</p>
      <Button
        onClick={() => {
          cancelActionMutation();
          setNow(Date.now());
        }}
        disabled={cancelIsPending}
        className="h-2 p-3"
      >
        Cancel
      </Button>
    </section>
  );
};

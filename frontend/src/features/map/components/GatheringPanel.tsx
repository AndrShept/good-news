import { GameIcon } from '@/components/GameIcon';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { Button } from '@/components/ui/button';
import { formatDurationFromSeconds } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { StateType } from '@/shared/types';
import { useEffect, useState } from 'react';

import { useCancelGatheringMutation } from '../hooks/useCancelGatheringMutation';

interface Props {
  heroState: StateType;
  gatheringFinishAt: number;
}

export const GatheringPanel = ({ heroState, gatheringFinishAt }: Props) => {
  const cancelGatheringMutation = useCancelGatheringMutation();
  const [now, setNow] = useState(() => Date.now());
  const resultTime = Math.max(Math.ceil(gatheringFinishAt - now), 0);
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <section className="bg-accent/70 sm:top-11 border top-27 absolute left-1/2 z-50 flex h-fit -translate-x-1/2 items-center gap-3 rounded-b px-4 py-2 text-sm backdrop-blur-sm">
      <AnimatedShinyText className="flex items-center gap-2">
        <GameIcon className="size-5" image={imageConfig.icon.state[heroState]} />
        <span>{heroState.toLowerCase()}...</span>
      </AnimatedShinyText>
      <p className="">{formatDurationFromSeconds(resultTime)}</p>
      <Button
        onClick={() => {
          cancelGatheringMutation.mutate();
          setNow(Date.now());
        }}
        disabled={cancelGatheringMutation.isPending}
        className="h-2 p-3"
      >
        Cancel
      </Button>
    </section>
  );
};

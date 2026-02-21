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
    // <section className="bg-secondary absolute left-1/2 z-50 flex h-fit w-fit -translate-x-1/2 flex-col items-center gap-1 rounded-b px-3 py-1.5 text-sm">
    <section className="bg-secondary   flex h-fit w-fit  flex-col items-center gap-1 rounded-b  text-sm">
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

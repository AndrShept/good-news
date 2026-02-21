import { AcceptButton } from '@/components/AcceptButton';
import { CancelButton } from '@/components/CancelButton';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { Button } from '@/components/ui/button';
import { useWalkMapMutation } from '@/features/hero/hooks/useWalkMapMutation';
import { StateType } from '@/shared/types';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { memo, useEffect, useState } from 'react';
import { useCancelWalkMutation } from '../hooks/useCancelWalkMutation';


type Props = {
  heroState: StateType;
};

export const MovingPanel = memo(function MovingPathInfo({ heroState }: Props) {
  const { movementPathTiles, setMovementPathTiles } = useMovementPathTileStore();
  const targetPos = movementPathTiles.at(-1);
  const [now, setNow] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const { mutate, isPending } = useWalkMapMutation(setFinishTime);
  const cancelWalkMutation = useCancelWalkMutation();
  const resultTime = Math.max(Math.ceil((finishTime - now) / 1000), 0);
  const onCLick = () => {
    if (!targetPos) return;
    mutate(targetPos);
    setNow(Date.now());
  };
  useEffect(() => {
    if (heroState !== 'WALK') return;
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [heroState]);
  useEffect(() => {
    return () => {
      setMovementPathTiles([]);
    };
  }, [setMovementPathTiles]);
  if (!movementPathTiles.length) return;
  return (
    <section className="bg-secondary absolute left-1/2 z-50 flex h-fit w-fit -translate-x-1/2 flex-col items-center gap-2 rounded-b px-4 py-3 text-sm">
      <div className="flex gap-1">
        <span className="text-muted-foreground">
          step: <span className="text-primary">{movementPathTiles.length}</span>
        </span>
        <span className="text-muted-foreground">
          time: <span className="text-primary">{resultTime ? `${resultTime.toFixed(0)}s` : '???'}</span>
        </span>
      </div>

      {heroState === 'IDLE' && (
        <div className="space-x-1">
          <CancelButton disabled={isPending} onClick={() => setMovementPathTiles([])} className="size-8" />
          <AcceptButton disabled={isPending} onClick={onCLick} className="size-8 border" />
        </div>
      )}
      {heroState === 'WALK' && (
        <>
          <AnimatedShinyText>moving...</AnimatedShinyText>

          <Button
            onClick={() => {
              cancelWalkMutation.mutate();
              setFinishTime(Date.now());
              setNow(Date.now());
            }}
            disabled={cancelWalkMutation.isPending}
            className="h-2 p-3"
          >
            Cancel
          </Button>
        </>
      )}
    </section>
  );
});

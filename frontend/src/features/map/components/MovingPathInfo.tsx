import { AcceptButton } from '@/components/AcceptButton';
import { CancelButton } from '@/components/CancelButton';
import { useWalkMapMutation } from '@/features/hero/hooks/useWalkMapMutation';
import { StateType } from '@/shared/types';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { memo } from 'react';

type Props = {
  heroState: StateType;
};

export const MovingPathInfo = memo(function MovingPathInfo({ heroState }: Props) {
  const { movementPathTiles, setMovementPathTiles } = useMovementPathTileStore();
  const targetPos = movementPathTiles.at(-1);
  const { mutate, isPending } = useWalkMapMutation();

  const onCLick = () => {
    if (!targetPos) return;
    mutate(targetPos);
  };
  if (!movementPathTiles.length) return;
  return (
    <section className="bg-secondary absolute left-1/2 z-50 flex h-fit w-fit -translate-x-1/2 items-center gap-2 rounded-b px-2.5 py-3 text-sm">
      <p className="text-muted-foreground/50">
        tile: <span className="text-primary">{movementPathTiles.length}</span>
      </p>
      <p className="text-muted-foreground/50">
        time: <span className="text-primary">{'40sec'}</span>
      </p>
      {heroState === 'IDLE' && (
        <div className="space-x-1">
          <CancelButton disabled={isPending} onClick={() => setMovementPathTiles([])} className="size-8" />
          <AcceptButton disabled={isPending} onClick={onCLick} className="size-8 border" />
        </div>
      )}
      {heroState === 'WALK' && <p>moving...</p>}
    </section>
  );
});

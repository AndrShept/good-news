import { AcceptButton } from '@/components/AcceptButton';
import { CancelButton } from '@/components/CancelButton';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';

export const MovingPathInfo = () => {
  const { movementPathTiles, setMovementPathTiles } = useMovementPathTileStore();
  if (!movementPathTiles.length) return;
  return (
    <section className="bg-secondary absolute left-1/2 z-50 flex h-fit w-fit  -translate-x-1/2 items-center gap-2 rounded-b px-2.5 py-3 text-sm">
      <p className="text-muted-foreground/50">
        tile: <span className="text-primary">{movementPathTiles.length}</span>
      </p>
      <p className="text-muted-foreground/50">
        time: <span className="text-primary">{'40sec'}</span>
      </p>
      <div className="space-x-1">
        <CancelButton onClick={() => setMovementPathTiles([])} className="size-8" />
        <AcceptButton className="size-8 border" />
      </div>
    </section>
  );
};

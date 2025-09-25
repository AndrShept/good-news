import { useWalkOnMap } from '@/features/hero/hooks/useWalkOnMap';
import { memo } from 'react';

interface Props {
  TILE_SIZE: number;
  x: number;
  y: number;
}

export const MovableTile = memo(function MovableTile({ x, y, TILE_SIZE }: Props) {
  const { mutate, isPending } = useWalkOnMap();

  return (
    <>
      <button
        disabled={isPending}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={() => {
          mutate({ x, y });
        }}
        className="absolute z-10 bg-black/50 hover:bg-black/60"
        style={{
          left: x * TILE_SIZE,
          top: y * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
        }}
      />
    </>
  );
});

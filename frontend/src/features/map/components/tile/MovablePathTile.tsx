import { X } from 'lucide-react';
import { memo } from 'react';

interface Props {
  TILE_SIZE: number;
  x: number;
  y: number;
  offsetY: number;
  offsetX: number;
}

export const MovablePathTile = memo(function MovablePathTile({ x, y, TILE_SIZE, offsetX, offsetY }: Props) {
  const localX = x - offsetX;
  const localY = y - offsetY;
  return (
    <>
      <div
        className="absolute inline-flex select-none items-center justify-center text-red-500"
        style={{
          transform: `translate(${localX * TILE_SIZE}px, ${localY * TILE_SIZE}px)`,
          width: TILE_SIZE,
          height: TILE_SIZE,
          backgroundImage: `url(/sprites/icons/ui/move-arrow.png)`,
          backgroundSize: 'cover',
        }}
      >
        {/* <X className="drop-shadow-outline stroke-amber-300" /> */}
      </div>
    </>
  );
});

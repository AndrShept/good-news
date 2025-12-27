import { memo } from 'react';

interface Props {
  TILE_SIZE: number;
  x: number;
  y: number;
}

export const MovablePathTile = memo(function MovablePathTile({ x, y, TILE_SIZE }: Props) {
  return (
    <>
      <div
        className="absolute bg-black/50"
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

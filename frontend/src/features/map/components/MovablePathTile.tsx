import { X } from 'lucide-react';
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
        className="absolute select-none inline-flex items-center justify-center text-red-500"
        style={{
          transform: `translate(${x * TILE_SIZE}px, ${y * TILE_SIZE}px)`,
          width: TILE_SIZE,
          height: TILE_SIZE,
        }}
      >
        <X
          style={{
            filter: `

    drop-shadow(0.5px 0 0 rgba(0,0,0,1))
      drop-shadow(-0.4px 0 0 rgba(0,0,0,1))
      drop-shadow(0 0.5px 0 rgba(0,0,0,1))
      drop-shadow(0 -0.3px 0 rgba(0,0,0,0.4))
`,
          }}
        />
      </div>
    </>
  );
});

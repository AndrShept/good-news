import { MapCreature } from '@/shared/types';
import { memo } from 'react';

interface Props extends MapCreature {
  TILE_SIZE: number;
  offsetY: number;
  offsetX: number;
  creatureCountInTile: number;
}

export const CreatureTile = memo(function CreatureTile({ x, y, image, creatureCountInTile, name, TILE_SIZE, offsetX, offsetY }: Props) {
  const localX = x - offsetX;
  const localY = y - offsetY;

  return (
    <div
      className="drop-shadow-outline-sm relative"
      style={{
        position: 'absolute',
        width: TILE_SIZE,
        height: TILE_SIZE,
        willChange: 'transform',
        transform: `translate(${localX * TILE_SIZE}px, ${localY * TILE_SIZE}px)`,
        backgroundSize: 'cover',
        backgroundImage: `url(${image})`,
      }}
    >
      {creatureCountInTile > 1 && (
        <div className="absolute -top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 text-xs">
          <p>{name}</p>

          <p className="leading-3.5 size-3.5 rounded-full bg-teal-800   text-center text-[8px] text-white">{creatureCountInTile}</p>
        </div>
      )}
    </div>
  );
});

import { MapCreature } from '@/shared/types';
import { memo } from 'react';

interface Props extends MapCreature {
  TILE_SIZE: number;
  offsetY: number;
  offsetX: number;
  countOnTile: number;
}

export const CreatureTile = memo(function CreatureTile({ x, y, image, countOnTile, name, TILE_SIZE, offsetX, offsetY }: Props) {
  const localX = x - offsetX;
  const localY = y - offsetY;

  return (
    <div
      className="drop-shadow-outline-sm relative"
      style={{
        position: 'absolute',
        width: TILE_SIZE,
        height: TILE_SIZE,
        transform: `translate(${localX * TILE_SIZE}px, ${localY * TILE_SIZE}px)`,
        backgroundSize: 'cover',
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="absolute -top-1.5 left-1/2 flex -translate-x-1/2 items-center gap-0.5 text-[6px]">
        <p>{name}</p>

        {countOnTile > 1 && <p className="leading-2 size-2 rounded-full bg-teal-800 text-center text-[5px] text-white">{countOnTile}</p>}
      </div>
    </div>
  );
});

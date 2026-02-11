import { Entrance } from '@/shared/types';
import { memo } from 'react';

import { TileImg } from './TileImg';

interface Props {
  TILE_SIZE: number;
  x: number;
  y: number;
  image: string;
}

export const EntranceTile = memo(function HeroTile({ x, y, image, TILE_SIZE }: Props) {
  return (
    <div
      className="relative drop-shadow-outline"
      style={{
        position: 'absolute',
        left: x * TILE_SIZE,
        top: y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,

      }}
    >
      <TileImg image={image} />
    </div>
  );
});

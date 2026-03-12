import { Entrance } from '@/shared/types';
import { memo } from 'react';

import { TileImg } from './TileImg';

interface Props {
  TILE_SIZE: number;
  x: number;
  y: number;
  image: string;
  offsetX: number;
  offsetY: number;
}

export const EntranceTile = memo(function HeroTile({ x, y, image, TILE_SIZE, offsetX, offsetY }: Props) {
  const localX = x - offsetX;
  const localY = y - offsetY;
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${localX * TILE_SIZE}px, ${localY * TILE_SIZE}px)`,
        backgroundSize: 'cover',
        backgroundImage: `url(${image})`,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
      className="drop-shadow-outline-sm"
    />
  );
});

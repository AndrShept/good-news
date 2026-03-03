import { TPlace } from '@/shared/types';
import { memo } from 'react';

import { TileImg } from './TileImg';

interface Props extends TPlace {
  TILE_SIZE: number;
}

export const PlaceTile = memo(({ TILE_SIZE, image, x, y }: Props) => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${x * TILE_SIZE}px, ${y * TILE_SIZE}px)`,
        backgroundSize: 'cover',
        backgroundImage: `url(${image})`,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
      className="drop-shadow-outline-sm"
    />
  );
});

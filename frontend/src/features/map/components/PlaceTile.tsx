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

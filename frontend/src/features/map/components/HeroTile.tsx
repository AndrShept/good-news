import { Location } from '@/shared/types';
import React from 'react';

import { TileImg } from './TileImg';

interface Props extends Location {
  TILE_SIZE: number;
}

export const HeroTile = ({ x, y, hero, TILE_SIZE }: Props) => {
  return (
    <div
      // onClick={() => removeMapTile({ tileId: tile.id })}
      style={{
        position: 'absolute',
        left: x * TILE_SIZE,
        top: y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
    >
      <TileImg image={hero?.characterImage ?? ''} />
    </div>
  );
};

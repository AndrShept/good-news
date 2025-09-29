import { Town } from '@/shared/types';

import { TileImg } from './TileImg';

interface Props extends Town {
  TILE_SIZE: number;
}

export const TownTile = ({ TILE_SIZE, image, x, y }: Props) => {
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
};

import { Tile } from '@/shared/types';
import { memo } from 'react';

interface Props extends Tile {
  tileWidth: number;
  tileHeight: number;
}
export const GameTile = memo(function GameTile({ x, y, z, id, image, type, tileHeight, tileWidth }: Props) {
  return (
    <div
      className="absolute hover:border"
      style={{
        left: `${x * tileWidth}px`,
        top: `${y * tileHeight}px`,
        height: `${tileHeight}px`,
        width: `${tileWidth}px`,
      }}
    >
      <img draggable={false} className="size-full" src={`/sprites/map/solmer-image/${image.toString().padStart(3, '0')}.png`} />
    </div>
  );
});

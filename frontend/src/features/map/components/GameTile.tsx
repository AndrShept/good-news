import { Tile } from '@/shared/types';
import { memo } from 'react';

import { useChangeMap } from '../hooks/useChangeMap';
import { WorldObjectTile } from './WorldObjectTile';

interface Props extends Tile {
  tileWidth: number;
  tileHeight: number;
}
export const GameTile = memo(function GameTile({ x, y, z, id, image, type, tileHeight, tileWidth, worldObject }: Props) {
  const { removeTile } = useChangeMap('SOLMERE');
  const { changeTile } = useChangeMap('SOLMERE');
  console.log('render tile');
  return (
    <div
      //  onClick={() => changeTile({tileId: id , params: {image: 8}})}
      onClick={() => removeTile({ tileId: id })}
      className="absolute"
      style={{
        left: `${x * tileWidth}px`,
        top: `${y * tileHeight}px`,
        height: `${tileHeight}px`,
        width: `${tileWidth}px`,
      }}
    >
      {<img draggable={false} className="size-full" src={`/sprites/map/solmer-image/${image.toString().padStart(3, '0')}.png`} />}
      {worldObject && <WorldObjectTile {...worldObject} />}
    </div>
  );
});

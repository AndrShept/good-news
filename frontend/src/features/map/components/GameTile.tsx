import { CustomTooltip } from '@/components/CustomTooltip';
import { cn } from '@/lib/utils';
import { Tile } from '@/shared/types';
import { memo } from 'react';

import { useChangeMap } from '../hooks/useChangeMap';
import { TileImg } from './TileImg';
import { WorldObjectTile } from './WorldObjectTile';

interface Props extends Tile {
  tileWidth: number;
  tileHeight: number;
}
export const GameTile = memo(function GameTile(props: Props) {
  const { x, y, z, id, image, type, tileHeight, tileWidth, worldObject } = props;
  const { removeTile } = useChangeMap('SOLMERE');
  const { changeTile } = useChangeMap('SOLMERE');
  console.log('render tile');
  return (
    <div
      onClick={() =>
        removeTile({
          tileId: id,
        })
      }
      className={cn('absolute')}
      style={{
        left: `${x * tileWidth}px`,
        top: `${y * tileHeight}px`,
        height: `${tileHeight}px`,
        width: `${tileWidth}px`,
        zIndex: z,
      }}
    >
      <TileImg image={image} />
      {worldObject && (
        <CustomTooltip>
          <CustomTooltip.Trigger>
            <WorldObjectTile {...worldObject} tileId={id} />
          </CustomTooltip.Trigger>
          <CustomTooltip.Content className="p-3">{worldObject.name}</CustomTooltip.Content>
        </CustomTooltip>
      )}
    </div>
  );
});

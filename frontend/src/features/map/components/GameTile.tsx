import { useWalkOnMap } from '@/features/hero/hooks/useWalkOnMap';
import { cn } from '@/lib/utils';
import { Tile } from '@/shared/types';
import { memo } from 'react';

import { useChangeMap } from '../hooks/useChangeMap';
import { HeroTile } from './HeroTile';
import { MovableTile } from './MovableTile';
import { TileImg } from './TileImg';
import { TownTile } from './TownTile';

interface Props extends Tile {
  tileWidth: number;
  tileHeight: number;
  isMovable: boolean;
  hasObject: boolean | undefined;
}
export const GameTile = memo(function GameTile(props: Props) {
  const { x, y, z, id, mapId, image, type, tileHeight, tileWidth, heroes, town, isMovable, hasObject } = props;
  const { removeTile } = useChangeMap(mapId);
  const { changeTile } = useChangeMap(mapId);

  console.log('render tile');
  return (
    <div
      // onClick={() => {
      //   removeTile({
      //     tileId: id,
      //   });
      // }}
      // onClick={() => {
      //   changeTile({
      //     tileId: id,
      //     params: {
      //      heroes: undefined
      //     },
      //   });
      // }}
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
      {isMovable && !hasObject && <MovableTile tileId={id} />}
      {town && <TownTile image={town.image} />}
      {!!heroes && heroes.map((hero) => <HeroTile key={hero.id} characterImage={hero.characterImage} />)}
    </div>
  );
});

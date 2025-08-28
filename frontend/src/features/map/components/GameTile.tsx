import { useHero } from '@/features/hero/hooks/useHero';
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
}
export const GameTile = memo(function GameTile(props: Props) {
  const { x, y, z, id, mapId, image, type, tileHeight, tileWidth, heroes, town } = props;
  const { removeTile } = useChangeMap(mapId);
  const { changeTile } = useChangeMap(mapId);
  const hero = useHero((state) => ({
    tile: state?.data?.tile,
  }));
  const isMovable =
    Math.abs((hero?.tile?.x ?? 0) - x) <= 1 && Math.abs((hero?.tile?.y ?? 0) - y) <= 1 && !(hero?.tile?.x === x && hero?.tile?.y === y);
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
      {isMovable && type === 'GROUND' && <MovableTile tileId={id} />}
      {town && <TownTile image={town.image} />}
      {!!heroes && heroes.map((hero) => <HeroTile key={hero.id} characterImage={hero.characterImage} />)}
    </div>
  );
});

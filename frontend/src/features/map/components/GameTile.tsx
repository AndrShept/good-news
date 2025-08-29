import { useHero, useHeroTile } from '@/features/hero/hooks/useHero';
import { useWalkOnMap } from '@/features/hero/hooks/useWalkOnMap';
import { cn } from '@/lib/utils';
import { Tile } from '@/shared/types';
import { memo, useCallback, useMemo } from 'react';

import { useChangeMap } from '../hooks/useChangeMap';
import { HeroTile } from './HeroTile';
import { MovableTile } from './MovableTile';
import { TileImg } from './TileImg';
import { TownTile } from './TownTile';

interface Props extends Tile {
  tileWidth: number;
  tileHeight: number;
  posX: number;
  posY: number;
}
export const GameTile = memo(function GameTile(props: Props) {
  const { x, y, z, id, mapId, image, type, tileHeight, tileWidth, heroes, town, posX, posY } = props;
  const { removeTile } = useChangeMap(mapId);
  const { changeTile } = useChangeMap(mapId);

  const isMovable = Math.abs(posX - x) <= 1 && Math.abs(posY - y) <= 1 && !(posX === x && posY === y);

  const { mutate } = useWalkOnMap();
  const onMove = () => {
    console.log(id);
    mutate(id);
  };
  console.log('render tile');
  return (
    <div
      onClick={onMove}
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

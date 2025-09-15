import { cn } from '@/lib/utils';
import { Tile } from '@/shared/types';
import { memo } from 'react';

import { HeroTile } from './HeroTile';
import { MovableTile } from './MovableTile';
import { TileImg } from './TileImg';
import { TownTile } from './TownTile';

interface Props extends Tile {
  isMovable: boolean;
}
export const GameTile = memo(function GameTile(props: Props) {
  const { id, image, heroes, town, isMovable } = props;
  console.log('render tile');
  return (
    <div className="size-full">
      <TileImg image={`/sprites/map/solmer-image/${image.toString().padStart(3, '0')}.png`} />
      {isMovable && <MovableTile tileId={id} />}
      {town && <TownTile image={town.image} />}
      {!!heroes && heroes.map((hero) => <HeroTile key={hero.id} characterImage={hero.characterImage} />)}
    </div>
  );
});

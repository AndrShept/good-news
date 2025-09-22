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
  const { id, image, town, townId, isMovable, type, location } = props;
  console.log('render tile');
  return (
    <div className="size-full">
      <TileImg image={`/sprites/map/solmer-image/${image.toString().padStart(3, '0')}.png`} />
      {isMovable && <MovableTile tileId={id} />}
      {town && <TownTile image={town.image} />}
      {type === 'HERO' && <HeroTile characterImage={location!.hero!.characterImage!} />}
    </div>
  );
});

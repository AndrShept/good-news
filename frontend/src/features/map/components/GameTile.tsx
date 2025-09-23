import { cn } from '@/lib/utils';
import { Tile } from '@/shared/types';
import { memo } from 'react';

import { HeroTile } from './HeroTile';
import { TileImg } from './TileImg';
import { TownTile } from './TownTile';

type Props = Tile;
export const GameTile = memo(function GameTile(props: Props) {
  const { image, town, type, location } = props;
  console.log('render tile');

  if (type === 'TOWN') {
    return <TownTile image={town?.image ?? ''} />;
  }

  if (type === 'HERO') {
    return <HeroTile characterImage={location?.hero?.characterImage ?? ''} />;
  }

  return <TileImg image={`/sprites/map/solmer-image/${image.toString().padStart(3, '0')}.png`} />;
});

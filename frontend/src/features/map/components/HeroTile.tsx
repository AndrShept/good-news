import { GameIcon } from '@/components/GameIcon';
import { imageConfig } from '@/shared/config/image-config';
import { MapHero } from '@/shared/types';
import { memo } from 'react';

import { TileImg } from './TileImg';

interface Props extends MapHero {
  TILE_SIZE: number;
}

export const HeroTile = memo(function HeroTile({ x, y, id, characterImage, name, state, TILE_SIZE }: Props) {
  return (
    <div
      className="relative"
      style={{
        position: 'absolute',
        left: x * TILE_SIZE,
        top: y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
    >
      <div className="absolute -top-4 flex -translate-x-2 items-center gap-0.5 text-xs">
        <GameIcon className="size-3" image={imageConfig.icon.state[state]} />
        <p>{name}</p>
      </div>
      <TileImg className="drop-shadow-lg/40" image={characterImage} />
    </div>
  );
});

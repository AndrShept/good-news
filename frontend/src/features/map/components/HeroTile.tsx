import { useHeroId } from '@/features/hero/hooks/useHeroId';
import {  MapHero } from '@/shared/types';
import { memo } from 'react';

import { TileImg } from './TileImg';

interface Props extends MapHero {
  TILE_SIZE: number;
}

export const HeroTile = memo(function HeroTile({ x, y, id, characterImage, TILE_SIZE }: Props) {
  const heroId = useHeroId();
  return (
    <div
      style={{
        position: 'absolute',
        left: x * TILE_SIZE,
        top: y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        filter:
          heroId === id
            ? `

    drop-shadow(0.5px 0 0 rgba(0,0,0,1))
      drop-shadow(-0.4px 0 0 rgba(0,0,0,1))
      drop-shadow(0 0.5px 0 rgba(0,0,0,1))
      drop-shadow(0 -0.3px 0 rgba(0,0,0,0.4))
`
            : undefined,
      }}
    >
      <TileImg image={characterImage} />
    </div>
  );
});

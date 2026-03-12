import { cn } from '@/lib/utils';
import React, { memo } from 'react';

interface Props {
  x: number;
  y: number;
  TILE_SIZE: number;
  image: string;
  
  // isChunk: boolean;
  // chunkColor: boolean;
  isChunkBorder: boolean;

}

export const MapTile = memo(({ TILE_SIZE, image, x, y, isChunkBorder}: Props) => {
  return (
    <div
      className={cn({
        'border border-secondary': isChunkBorder,
      })}
      style={{
        position: 'absolute',

        width: TILE_SIZE,
        height: TILE_SIZE,
        transform: `translate(${x * TILE_SIZE }px, ${y * TILE_SIZE }px)`,
        backgroundSize: 'cover',
        backgroundImage: `url(${image})`,
      }}
    />
  );
});

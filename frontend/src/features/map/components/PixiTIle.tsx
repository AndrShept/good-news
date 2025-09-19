import { Tile } from '@/shared/types';
import { extend } from '@pixi/react';
import { BufferImageSource, Sprite, Texture } from 'pixi.js';
import React, { Dispatch, RefObject, SetStateAction, memo } from 'react';

interface Props extends Tile {
  texture: RefObject<Texture | null>;
}
const TILE_SIZE = 32;
extend({ Sprite });
export const PixiTile = memo(({ id, x, y, texture }: Props) => {
  console.log('RENDER TILE');
  return (
    <>
      <pixiSprite
      
        onClick={() => {
          console.log(id);
        }}
        roundPixels={true}
        interactive={true}
        texture={texture.current!}
        x={Math.floor(x * TILE_SIZE)}
        y={Math.floor(y * TILE_SIZE)}
        width={TILE_SIZE}
        height={TILE_SIZE}
        tint={(x / TILE_SIZE) % 2 === 0 && (y / TILE_SIZE) % 2 === 0 ? 0x3498db : 0x2ecc71}
      />
      {x === 0 && y === 0 && (
        <pixiSprite
          onClick={() => console.log(id)}
          interactive={true}
          texture={texture.current!}
          x={x * TILE_SIZE}
          y={y * TILE_SIZE}
          width={TILE_SIZE}
          height={TILE_SIZE}
          tint={'red'}
          zIndex={1}
        />
      )}
    </>
  );
});

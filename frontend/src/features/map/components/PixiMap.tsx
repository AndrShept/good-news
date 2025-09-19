import { useHero } from '@/features/hero/hooks/useHero';
import { extend, useApplication } from '@pixi/react';
import { useQuery } from '@tanstack/react-query';
import { Viewport } from 'pixi-viewport';
import { Assets, Container, Rectangle, Sprite, Text, Texture, TextureSource } from 'pixi.js';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { getMapOptions } from '../api/get-map';
import { PixiTile } from './PixiTIle';

extend({ Container, Sprite, Viewport, Text });

// const TILE_SIZE = 32;
// const MAP_WIDTH = 100;
// const MAP_HEIGHT = 100;

// const tiles = Array.from({ length: MAP_HEIGHT * MAP_WIDTH }).map((_, i) => {
//   const x = (i % MAP_WIDTH) * TILE_SIZE;
//   const y = Math.floor(i / MAP_WIDTH) * TILE_SIZE;

//   return { id: i, x, y, texture: Texture.WHITE };
// });

export const PixiMap = () => {
  const viewportRef = useRef<Viewport>(null);
  console.log('RENDER PixiMap');
  const hero = useHero((state) => ({
    posX: state?.data?.tile?.x ?? 0,
    posY: state?.data?.tile?.y ?? 0,
    tileId: state?.data?.tileId ?? '',
    mapId: state?.data?.location?.mapId ?? '',
    townId: state?.data?.location?.townId ?? '',
  }));
  const { data: map, isLoading, isError, error } = useQuery(getMapOptions(hero.mapId, hero.townId));
  const tileWidth = map?.tileWidth ?? 32;
  const tileHeight = map?.tileHeight ?? 32;
  const mapHeight = map?.height ?? 0;
  const mapWidth = map?.width ?? 0;
  const textureRef = useRef<null | Texture>(null);
  const [isPending, startTransition] = useTransition();
  const { app } = useApplication();

  useEffect(() => {
    console.log(map);
    startTransition(async () => {
      // const tileSet = await Assets.load<TextureSource>('/sprites/raven.png');
      const sprite = await Assets.load<TextureSource>('/sprites/map/solmer-image/012.png');
      // const texture = new Texture({
      //   frame: new Rectangle(256, 0, 32, 32),
      //   source: tileSet,

      // });
      sprite.scaleMode ='nearest'
      const texture = sprite
      textureRef.current = texture;
    });
    if (viewportRef.current) {
      viewportRef.current.drag().wheel().pinch({ noDrag: true }).decelerate({ minSpeed: 0.1 });
      viewportRef.current.clamp({
        direction: 'all',
      });
      viewportRef.current.clampZoom({
        minScale: 0.7,
        maxScale: 4,
      });
    }
  }, [map]);

  if (isLoading) return <pixiText text="LOADING MAP..." x={50} y={50} style={{ fill: 'white', fontSize: 24 }} />;
  if (isPending) return <pixiText text="LOADING TEXTURE..." x={50} y={50} style={{ fill: 'white', fontSize: 24 }} />;
  return (
    // <viewport
    //   ref={viewportRef}
    //   screenWidth={window.innerWidth}
    //   screenHeight={window.innerHeight}
    //   worldWidth={mapWidth}
    //   worldHeight={mapHeight}
    //   events={app.renderer.events}
    // >
      <pixiContainer   >
        <pixiSprite  width={100} height={100} x={10} y={20} texture={textureRef.current} />
        {map?.tilesGrid!.map((col, y) =>
          col.map((tile, x) => {
            if (!tile) return;
            return <PixiTile {...tile} key={tile.id} texture={textureRef} />;
          }),
        )}
      </pixiContainer>
    // </viewport>
  );
};

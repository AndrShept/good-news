import { useApplication } from '@pixi/react';
import { extend } from '@pixi/react';
import { Assets, Container, Rectangle, RenderTexture, Sprite, Texture } from 'pixi.js';
import { useEffect, useState } from 'react';

extend({ Container, Sprite, Texture });

interface Props {
  grounds: number[];
  MAP_WIDTH: number;
  TILE_SIZE: number;
  tileImage: string;
}

export const MapTileList = ({ grounds, MAP_WIDTH, TILE_SIZE, tileImage }: Props) => {
 const { app } = useApplication() 
  const [bakedTexture, setBakedTexture] = useState<RenderTexture | null>(null);

  useEffect(() => {
    Assets.load(tileImage).then((source: Texture) => {
      const tilesetWidth = Math.floor(source.width / TILE_SIZE);
      const container = new Container();

      // малюємо всі тайли в тимчасовий контейнер
      grounds.forEach((tileId, index) => {
        const x = (index % MAP_WIDTH) * TILE_SIZE;
        const y = Math.floor(index / MAP_WIDTH) * TILE_SIZE;
        const sx = ((tileId - 1) % tilesetWidth) * TILE_SIZE;
        const sy = Math.floor((tileId - 1) / tilesetWidth) * TILE_SIZE;

        const texture = new Texture({
          source: source.source,
          frame: new Rectangle(sx, sy, TILE_SIZE, TILE_SIZE),
        });

        const sprite = new Sprite(texture);
        sprite.x = x;
        sprite.y = y;
        container.addChild(sprite);
      });

      // запікаємо все в одну текстуру — як твій Canvas.drawImage
      const rt = RenderTexture.create({
        width: MAP_WIDTH * TILE_SIZE,
        height: Math.ceil(grounds.length / MAP_WIDTH) * TILE_SIZE,
      });

      app.renderer.render({ container, target: rt });
      container.destroy({ children: true }); // чистимо пам'ять
      setBakedTexture(rt);
    });
  }, [tileImage, grounds]);

  if (!bakedTexture) return null;

  // вся карта = один спрайт = одна draw call
  return <pixiSprite texture={bakedTexture} x={0} y={0} />;
};

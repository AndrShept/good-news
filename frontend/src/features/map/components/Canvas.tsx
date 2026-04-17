import React, { ComponentProps, useEffect, useRef } from 'react';

interface Props extends ComponentProps<'canvas'> {
  grounds: number[];
  MAP_WIDTH: number;
  TILE_SIZE: number;
  tileImage: string;
}

export const Canvas = ({ grounds, MAP_WIDTH, TILE_SIZE, tileImage, ...props }: Props) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = tileImage;
    

    img.onload = () => {
      const tilesetWidth = img.width / TILE_SIZE;

      grounds.forEach((tileId, index) => {
        const x = index % MAP_WIDTH;
        const y = Math.floor(index / MAP_WIDTH);

        const dx = x * TILE_SIZE;
        const dy = y * TILE_SIZE;

        const sx = ((tileId - 1) % tilesetWidth) * TILE_SIZE;
        const sy = Math.floor(tileId / tilesetWidth) * TILE_SIZE;

        ctx.drawImage(img, sx, sy, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE);
      });
    };
  }, [grounds]);

  return <canvas ref={ref} {...props}></canvas>;
};

import { Layer, Tileset } from '@/shared/json-types';
import { ComponentProps, memo, useCallback, useEffect, useMemo, useRef } from 'react';

interface Props extends ComponentProps<'canvas'> {
  layers: Layer[];
  tileset: Tileset[];
  MAP_WIDTH: number;
  TILE_SIZE: number;
}

function resolveTile(gid: number, tilesets: Tileset[]) {
  const tileset = tilesets.find((t) => gid >= t.firstgid);
  if (!tileset) return null;
  return {
    tileset,
    localId: gid - tileset.firstgid,
  };
}

export const Canvas = memo(({ layers, tileset, MAP_WIDTH, TILE_SIZE, ...props }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  const sortedTilesets = useMemo(() => {
    return [...tileset].sort((a, b) => b.firstgid - a.firstgid);
  }, [tileset]);

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

       layers.forEach((layer) => {
      layer.data?.forEach((gid, index) => {
        if (gid === 0) return;

        const resolved = resolveTile(gid, sortedTilesets);
        if (!resolved) return;

        const { tileset, localId } = resolved;
        const img = imagesRef.current[tileset.image];
        if (!img) return;

        const columns = tileset.columns;
        const sx = (localId % columns) * TILE_SIZE;
        const sy = Math.floor(localId / columns) * TILE_SIZE;
        const dx = (index % MAP_WIDTH) * TILE_SIZE;
        const dy = Math.floor(index / MAP_WIDTH) * TILE_SIZE;

        ctx.drawImage(img, sx, sy, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE);
      });
        });
  }, [layers, sortedTilesets, TILE_SIZE, MAP_WIDTH]);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      await Promise.all(
        sortedTilesets.map(
          (ts) =>
            new Promise<void>((resolve) => {
              if (imagesRef.current[ts.image]) return resolve();

              const img = new Image();
              img.src = `/sprites/map/${ts.name}.png`;
              img.onload = () => {
                imagesRef.current[ts.image] = img;
                resolve();
              };
              img.onerror = () => resolve();
            }),
        ),
      );

      if (!isMounted) return;
      drawMap();
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [sortedTilesets, drawMap]);

  useEffect(() => {
    if (Object.keys(imagesRef.current).length > 0) {
      drawMap();
    }
  }, [drawMap]);

  return <canvas ref={canvasRef} {...props} />;
});

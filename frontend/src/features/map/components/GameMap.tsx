import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';
import { VirtualizerOptions, elementScroll, useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useRef } from 'react';

import { getMapOptions } from '../api/get-map';
import { GameTile } from './GameTile';
import { ScrollMap } from './ScrollMap';
import { TileInfo } from './TileInfo';

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}
export const GameMap = () => {
  const hero = useHero((state) => ({
    posX: state?.data?.tile?.x ?? 0,
    posY: state?.data?.tile?.y ?? 0,
    tileId: state?.data?.tileId ?? '',
    mapId: state?.data?.location?.mapId ?? '',
  }));
  const { data: map, isLoading, isError, error } = useQuery(getMapOptions(hero.mapId));
  const tileWidth = map?.tileWidth ?? 32;
  const tileHeight = map?.tileHeight ?? 32;
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef<number>(100);
  const scrollToFn: VirtualizerOptions<any, any>['scrollToFn'] = useCallback((offset, canSmooth, instance) => {
    const duration = 1000;
    const start = parentRef.current?.scrollTop || 0;
    const startTime = (scrollingRef.current = Date.now());

    const run = () => {
      if (scrollingRef.current !== startTime) return;
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
      const interpolated = start + (offset - start) * progress;

      if (elapsed < duration) {
        elementScroll(interpolated, canSmooth, instance);
        requestAnimationFrame(run);
      } else {
        elementScroll(interpolated, canSmooth, instance);
      }
    };

    requestAnimationFrame(run);
  }, []);
  const rowVirtualizer = useVirtualizer({
    count: map?.tilesGrid ? map.tilesGrid.length : 1,

    getScrollElement: () => parentRef.current,
    estimateSize: () => tileHeight,
    initialOffset: -300,
    overscan: 5,
    // scrollToFn
  });

  const colVirtualizer = useVirtualizer({
    count: map?.tilesGrid ? map.tilesGrid[0].length : 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => tileWidth,
    initialOffset: -500,
    horizontal: true,
    overscan: 5,
    // scrollToFn
  });

  if (isLoading) return <p>LOADING MAP...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!map) return <p>NO MAP FOUND</p>;

  return (
    <section className="flex flex-col gap-2">
      <ScrollMap posX={hero.posX} posY={hero.posY} colVirtualizer={colVirtualizer} rowVirtualizer={rowVirtualizer} />
      <div className="flex justify-center gap-2">
        <div ref={parentRef} className="overflow-auto" style={{ height: 400, width: 600 }}>
          <ul
            style={{
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) =>
              colVirtualizer.getVirtualItems().map((virtualCol) => {
                const tile = map.tilesGrid![virtualRow.index][virtualCol.index];
                if (!tile) return;

                const isMovable =
                  Math.abs(virtualCol.index - hero.posX) <= 1 &&
                  Math.abs(virtualRow.index - hero.posY) <= 1 &&
                  !(virtualCol.index === hero.posX && virtualRow.index === hero.posY);

                return (
                  <div
                    key={tile.id}
                    style={{
                      position: 'absolute',
                      top: virtualRow.start,
                      left: virtualCol.start,
                      width: virtualCol.size,
                      height: virtualRow.size,
                    }}
                  >
                    <GameTile {...tile} isMovable={isMovable} />
                  </div>
                );
              }),
            )}
          </ul>
        </div>
        <TileInfo mapId={hero.mapId} posX={hero.posX} posY={hero.posY} tileId={hero.tileId} />
      </div>
    </section>
  );
};

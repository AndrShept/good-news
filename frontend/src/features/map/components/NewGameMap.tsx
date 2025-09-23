import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { getMapOptions } from '../api/get-map';
import { useDragOnMap } from '../hooks/useDragOnMap';
import { useScaleMap } from '../hooks/useScaleMap';
import { useSetHoverIndex } from '../hooks/useSetHoverIndex';
import { GameTile } from './GameTile';
import { HeroTile } from './HeroTile';
import { MovableTile } from './MovableTile';

export const NewGameMap = () => {
  const hero = useHero((state) => ({
    posX: state?.data?.location?.tile?.x ?? 0,
    posY: state?.data?.location?.tile?.y ?? 0,
    tileId: state?.data?.location?.tileId ?? '',
    mapId: state?.data?.location?.tile?.mapId ?? '',
    townId: state?.data?.location?.townId ?? '',
  }));
  const { data: map, isLoading, isError, error } = useQuery(getMapOptions(hero.mapId, hero.townId));
  const TILE_SIZE = map?.tileWidth ?? 32;
  const MAP_HEIGHT = map?.height ?? 0;
  const MAP_WIDTH = map?.width ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);

  const { handleWheel, scale } = useScaleMap();
  const [isDragging, setIsDragging] = useState(false);
  const { handleMouseMove, hoverIndex, setStart } = useSetHoverIndex({
    containerRef,
    isDragging,
    MAP_HEIGHT,
    MAP_WIDTH,
    scale,
    TILE_SIZE,
  });
  const { handleMouseDown, handleMouseUp } = useDragOnMap({ setIsDragging, setStart });
  if (isLoading) return <p>LOADING MAP...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!map) return <p>NO MAP FOUND</p>;
  console.log('MAP PAGE RENDER');
  return (
    <section
      ref={containerRef}
      className="relative mx-auto aspect-video h-[500px] overflow-hidden rounded border"
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
   
    >
      <ul
        className="relative origin-top-left"
        style={{
          imageRendering: 'pixelated',
          width: MAP_WIDTH * TILE_SIZE,
          height: MAP_HEIGHT * TILE_SIZE,
          backgroundImage: `url(${map.image})`,
          transform: `scale(${scale})`,
        }}
      >
        {map.tilesGrid?.map((col, y) =>
          col.map((tile, x) => {
            const isMovable = Math.abs(x - hero.posX) <= 1 && Math.abs(y - hero.posY) <= 1 && !(x === hero.posX && y === hero.posY);
            const isBlocked = tile?.type === 'OBJECT' || tile?.type === 'WATER';
            return (
              <div
                key={`${x}${y}`}
                style={{
                  position: 'absolute',
                  left: x * TILE_SIZE,
                  top: y * TILE_SIZE,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                }}
              >
                {isMovable && (!tile || !isBlocked) && <MovableTile tilePosition={{ x, y }} />}
                {tile && <GameTile {...tile} />}
              </div>
            );
          }),
        )}

        {/* {hoverIndex !== null && !isDragging && (
          <div
            style={{
              position: 'absolute',
              left: (hoverIndex % MAP_WIDTH) * TILE_SIZE,
              top: Math.floor(hoverIndex / MAP_WIDTH) * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              backgroundColor: 'rgba(0, 255, 0, 0.3)',
              pointerEvents: 'none',
            }}
          />
        )} */}
      </ul>
    </section>
  );
};

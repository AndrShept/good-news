import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroActions } from '@/features/hero/hooks/useHeroActions';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { getMapOptions } from '../api/get-map';
import { useDragOnMap } from '../hooks/useDragOnMap';
import { useMapUpdate } from '../hooks/useMapUpdate';
import { useScaleMap } from '../hooks/useScaleMap';
import { useSetHoverIndex } from '../hooks/useSetHoverIndex';
import { GameTile } from './GameTile';
import { MovableTile } from './MovableTile';

export const NewGameMap = () => {
  const hero = useHero((state) => ({
    x: state?.data?.location?.x ?? 0,
    y: state?.data?.location?.y ?? 0,
    tileId: state?.data?.location?.tile?.id ?? '',
    mapId: state?.data?.location?.mapId ?? '',
    townId: state?.data?.location?.townId ?? '',
  }));
  const { data: map, isLoading, isError, error } = useQuery(getMapOptions(hero.mapId));
  const TILE_SIZE = map?.tileWidth ?? 32;
  const MAP_HEIGHT = map?.height ?? 0;
  const MAP_WIDTH = map?.width ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const { removeMapTile } = useMapUpdate(hero.mapId);
  const { scale } = useScaleMap(containerRef);
  const [isDragging, setIsDragging] = useState(false);
  const { handleMouseMove, hoverIndex, setStart } = useSetHoverIndex({
    containerRef,
    isDragging,
    MAP_HEIGHT,
    MAP_WIDTH,
    scale,
    TILE_SIZE,
  });
  const { movedTiles } = useHeroActions();
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
      onMouseLeave={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
        {map.tiles?.map((tile) => (
          <div
            // onClick={() => removeMapTile({ tileId: tile.id })}
            key={tile.id}
            style={{
              position: 'absolute',
              left: tile.x * TILE_SIZE,
              top: tile.y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
          >
            <GameTile {...tile} />
          </div>
        ))}
        {movedTiles?.map((position, idx) => <MovableTile key={idx} TILE_SIZE={TILE_SIZE} {...position} />)}
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

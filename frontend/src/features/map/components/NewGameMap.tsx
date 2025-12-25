import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroActions } from '@/features/hero/hooks/useHeroActions';
import { useQueries } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { getMapOptions } from '../api/get-map';
import { getMapHeroesLocationOptions } from '../api/get-map-heroes';
import { useDragOnMap } from '../hooks/useDragOnMap';
import { useScaleMap } from '../hooks/useScaleMap';
import { useSetHoverIndex } from '../hooks/useSetHoverIndex';
import { HeroActionsBar } from './HeroActionsBar';
import { HeroTile } from './HeroTile';
import { LocationHeroesList } from './LocationHeroesList';
import { MovableTile } from './MovableTile';
import { PlaceTile } from './PlaceTile';

export const NewGameMap = () => {
  const hero = useHero((data) => ({
    x: data?.location?.x ?? 0,
    y: data?.location?.y ?? 0,
    mapId: data?.location?.mapId ?? '',
    placeId: data?.location?.placeId ?? '',
    state: data?.state ?? 'IDLE',
  }));

  const result = useQueries({ queries: [getMapOptions(hero.mapId), getMapHeroesLocationOptions(hero.mapId)] });
  const map = result[0].data;
  const heroesLocation = result[1].data;
  const isLoading = result.some((r) => r.isLoading);
  const TILE_SIZE = map?.tileWidth ?? 32;
  const MAP_HEIGHT = map?.height ?? 0;
  const MAP_WIDTH = map?.width ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);
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
  const { movedTiles, isHeroOnTownTile, heroesAtHeroPos, canFish } = useHeroActions();
  const { handleMouseDown, handleMouseUp } = useDragOnMap({ setIsDragging, setStart });

  if (isLoading) return <p>LOADING MAP...</p>;

  console.log('MAP PAGE RENDER');
  return (
    <section className="flex gap-2">
      <div className="flex w-full gap-2">
        <div className="flex w-[130px] flex-col gap-2">
          <HeroActionsBar canFish={canFish} isHeroOnTownTile={isHeroOnTownTile} state={hero.state} />
          <LocationHeroesList locationHeroes={heroesAtHeroPos} isLoading={isLoading} />
        </div>

        <div
          ref={containerRef}
          className="relative aspect-video h-[500px] overflow-hidden rounded border"
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
              backgroundImage: `url(${map?.image})`,
              transform: `scale(${scale})`,
            }}
          >
            {map?.places?.map((place) => <PlaceTile key={place.id} {...place} TILE_SIZE={TILE_SIZE} />)}
            {heroesLocation?.map((location) => {
              return <HeroTile key={location.id} {...location} TILE_SIZE={TILE_SIZE} />;
            })}
            {movedTiles?.map((position) => <MovableTile key={`${position.x}-${position.y}`} TILE_SIZE={TILE_SIZE} {...position} />)}
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
        </div>
      </div>
    </section>
  );
};

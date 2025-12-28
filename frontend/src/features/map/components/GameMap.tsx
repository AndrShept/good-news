import { Location, Place } from '@/shared/types';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { useRef, useState } from 'react';

import { useDragOnMap } from '../hooks/useDragOnMap';
import { useScaleMap } from '../hooks/useScaleMap';
import { useSetHoverIndex } from '../hooks/useSetHoverIndex';
import { HeroTile } from './HeroTile';
import { MovablePathTile } from './MovablePathTile';
import { PlaceTile } from './PlaceTile';

interface Props {
  heroPosX: number;
  heroPosY: number;
  heroesLocation: Location[] | undefined;
  places: Place[] | undefined;
  tileWidth: number;
  height: number;
  width: number;
  image: string;
  isLoading: boolean;
}

export const GameMap = ({ image, height, tileWidth, width, heroPosX, heroPosY, heroesLocation, places, isLoading }: Props) => {
  const TILE_SIZE = tileWidth;
  const MAP_HEIGHT = height;
  const MAP_WIDTH = width;

  const containerRef = useRef<HTMLDivElement>(null);

  const { scale } = useScaleMap(containerRef);
  const [isDragging, setIsDragging] = useState(false);

  const { handleMouseMove, hoverIndex, setStart, handleMouseLeave, handleTap } = useSetHoverIndex({
    containerRef,
    isDragging,
    MAP_HEIGHT,
    MAP_WIDTH,
    scale,
    TILE_SIZE,
    heroPosX,
    heroPosY,
  });

  const { handleMouseDown, handleMouseUp } = useDragOnMap({
    setIsDragging,
    setStart,
  });
  const movementPathTiles = useMovementPathTileStore((state) => state.movementPathTiles);

  if (isLoading) return 'Loading Map...';
  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-video w-full max-w-[700px] overflow-hidden rounded border"
      style={{
        cursor: isDragging ? 'grabbing' : 'default',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onPointerDown={handleMouseDown}
      onPointerMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerUp={handleMouseUp}
      onPointerCancel={handleMouseUp}
      onClick={handleTap}
    >
      <ul
        className="relative origin-top-left"
        style={{
          imageRendering: 'pixelated',
          width: MAP_WIDTH * TILE_SIZE,
          height: MAP_HEIGHT * TILE_SIZE,
          backgroundImage: `url(${image})`,
          transform: `scale(${scale})`,
        }}
      >
        {places?.map((place) => <PlaceTile key={place.id} {...place} TILE_SIZE={TILE_SIZE} />)}

        {heroesLocation?.map((location) => <HeroTile key={location.id} {...location} TILE_SIZE={TILE_SIZE} />)}

        {movementPathTiles?.map((position) => <MovablePathTile key={`${position.x}${position.y}`} {...position} TILE_SIZE={TILE_SIZE} />)}

        {hoverIndex !== null && !isDragging && (
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
        )}
      </ul>
    </div>
  );
};

import { Layer } from '@/shared/json-types';
import { Entrance, MapHero, StateType, TPlace } from '@/shared/types';
import { buildPathWithObstacles } from '@/shared/utils';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { RefObject, memo, useEffect, useRef, useState } from 'react';

import { useDragOnMap } from '../hooks/useDragOnMap';
import { useScaleMap } from '../hooks/useScaleMap';
import { useSetHoverIndex } from '../hooks/useSetHoverIndex';
import { EntranceTile } from './EntranceTile';
import { HeroTile } from './HeroTile';
import { MapTile } from './MapTile';
import { MovablePathTile } from './MovablePathTile';
import { PlaceTile } from './PlaceTile';

interface Props {
  heroTargetX: number;
  heroTargetY: number;
  heroState: StateType;
  mapHeroes: MapHero[] | undefined;
  places: TPlace[] | undefined;
  entrances: Entrance[] | undefined;
  tileWidth: number;
  height: number;
  width: number;
  image: string;
  isLoading: boolean;
  layers: Layer[];
  containerRef: RefObject<HTMLDivElement | null>;
  scale: number;
  heroWorldX: number;
  heroWorldY: number;

  heroLocalX: number;
  heroLocalY: number;
  offsetX: number;
  offsetY: number;
}

export const GameMap = memo(
  ({
    image,
    heroState,
    height,
    tileWidth,
    width,
    mapHeroes,
    places,
    entrances,
    isLoading,
    layers,
    heroTargetX,
    heroTargetY,
    containerRef,
    scale,
    heroWorldX,
    heroWorldY,
    offsetX,
    offsetY,

    heroLocalX,
    heroLocalY,
  }: Props) => {
    const TILE_SIZE = tileWidth;
    const MAP_HEIGHT = height;
    const MAP_WIDTH = width;

    const [isDragging, setIsDragging] = useState(false);

    const { handleMouseMove, hoverIndex, setStart, handleMouseLeave, handleTap } = useSetHoverIndex({
      containerRef,
      isDragging,
      MAP_HEIGHT,
      MAP_WIDTH,
      scale,
      TILE_SIZE,

      heroWorldX,
      heroWorldY,

      heroState,
      layers,

      offsetX,
      offsetY,
    });

    const { handleMouseDown, handleMouseUp } = useDragOnMap({
      setIsDragging,
      setStart,
    });
    const { setMovementPathTiles, movementPathTiles } = useMovementPathTileStore();
    const groundLayer = layers?.find((l) => l.name === 'GROUND');
    useEffect(() => {
      if (heroTargetY && heroTargetX && !movementPathTiles.length) {
        setMovementPathTiles({
          heroTargetX: heroTargetX - offsetX,
          heroTargetY: heroTargetY - offsetY,
          heroWorldX,
          heroWorldY,
          layers,
          MAP_HEIGHT,
          MAP_WIDTH,
          offsetX,
          offsetY,
        });
      }
    }, [heroTargetX, heroTargetY, layers]);
    const CHUNK_SIZE = 10;

    // if (isLoading) return 'Loading Map...';
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
            transform: `scale(${scale})`,
          }}
        >
          {groundLayer?.data.map((n, idx) => {
            const x = idx % MAP_WIDTH;
            const y = Math.floor(idx / MAP_WIDTH);

            const dx = x - heroLocalX;
            const dy = y - heroLocalY;
            const radius = 60;

            const isNear = dx * dx + dy * dy <= radius * radius;

            const isChunkBorder = x % CHUNK_SIZE === 0 || y % CHUNK_SIZE === 0;
            if (!isNear) return;
            return (
              <MapTile
                key={`${n}:${idx}`}
                image={`/sprites/map/ground-pack/${(n - 1).toString().padStart(3, '0')}.png`}
                TILE_SIZE={TILE_SIZE}
                x={x}
                y={y}
                isChunkBorder={isChunkBorder}
              />
            );
          })}
          {/* {places?.map((place) => <PlaceTile key={place.id} {...place} TILE_SIZE={TILE_SIZE} />)}
          {entrances?.map((entrance) => (
            <EntranceTile key={entrance.id} x={entrance.x} y={entrance.y} image={entrance.image} TILE_SIZE={TILE_SIZE} />
          ))} */}
          {mapHeroes?.map((hero) => <HeroTile key={hero.id} {...hero} TILE_SIZE={TILE_SIZE} offsetX={offsetX} offsetY={offsetY} />)}
          {movementPathTiles?.map((position) => (
            <MovablePathTile key={`${position.x}${position.y}`} {...position} TILE_SIZE={TILE_SIZE} offsetX={offsetX} offsetY={offsetY} />
          ))}

          {hoverIndex !== null && !isDragging && heroState === 'IDLE' && (
            <div
              style={{
                position: 'absolute',
                transform: `translate(${(hoverIndex % MAP_WIDTH) * TILE_SIZE}px, ${Math.floor(hoverIndex / MAP_WIDTH) * TILE_SIZE}px)`,
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
  },
);

import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { Layer, Tileset } from '@/shared/json-types';
import { Entrance, MapCorpse, MapCreature, MapHero, StateType, TPlace } from '@/shared/types';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { Application } from '@pixi/react';
import { RefObject, memo, useEffect, useMemo, useRef, useState } from 'react';

import { useDragOnMap } from '../hooks/useDragOnMap';
import { useSetHoverIndex } from '../hooks/useSetHoverIndex';
import { Canvas } from './Canvas';
import { MapEntityTile } from './MapEntityTile';
import { MovablePathTile } from './tile/MovablePathTile';

interface Props {
  heroTargetX: number;
  heroTargetY: number;
  heroState: StateType;
  mapEntities:
    | {
        heroes: MapHero[];
        corpses: MapCorpse[];
        creatures: MapCreature[];
      }
    | undefined;
  places: TPlace[];
  entrances: Entrance[];
  tileset: Tileset[];
  tileWidth: number;
  height: number;
  width: number;
  layers: Layer[];
  containerRef: RefObject<HTMLDivElement | null>;
  callbackRef: (el: HTMLDivElement | null) => void;
  scale: number;
  heroWorldX: number;
  heroWorldY: number;
  heroLocalX: number;
  heroLocalY: number;
  offsetX: number;
  offsetY: number;
}

export const GameMap = memo(function GameMap({
  heroState,
  height,
  tileWidth,
  width,
  tileset,
  places,
  entrances,
  mapEntities,
  layers,
  heroTargetX,
  heroTargetY,
  containerRef,
  callbackRef,
  scale,
  heroWorldX,
  heroWorldY,
  offsetX,
  offsetY,
}: Props) {
  const TILE_SIZE = tileWidth;
  const MAP_HEIGHT = height;
  const MAP_WIDTH = width;

  const isDraggingRef = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const heroId = useHeroId();
  const allEntities = useMemo(
    () => [
      ...(mapEntities?.heroes ?? []).map((e) => ({ ...e, entityType: 'HERO' as const })),
      ...(mapEntities?.creatures ?? []).map((e) => ({ ...e, entityType: 'CREATURE' as const })),
      ...(mapEntities?.corpses ?? []).map((e) => ({ ...e, entityType: 'CORPSE' as const })),
    ],
    [mapEntities],
  );
  const { handleMouseMove, hoverIndexRef, setStart, handleMouseLeave, handleTap } = useSetHoverIndex({
    containerRef,
    isDraggingRef,
    MAP_HEIGHT,
    MAP_WIDTH,
    scale,
    TILE_SIZE,
    hoverRef,
    heroWorldX,
    heroWorldY,
    heroState,
    layers,
    offsetX,
    offsetY,
  });
  const { handleMouseDown, handleMouseUp } = useDragOnMap({
    isDraggingRef,
    setIsDragging,
    setStart,
  });

  const { setMovementPathTiles, movementPathTiles } = useMovementPathTileStore();

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

  return (
    <div
      ref={(el) => {
        callbackRef(el);
        containerRef.current = el;
      }}
      className="relative  aspect-video w-full mx-auto max-w-[700px] self-start overflow-hidden rounded border"
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
      <div
        className="relative origin-top-left"
        style={{
          imageRendering: 'pixelated',
          width: MAP_WIDTH * TILE_SIZE,
          height: MAP_HEIGHT * TILE_SIZE,
          transform: `scale(${scale})`,
        }}
      >
        <Canvas
          tileset={tileset}
          layers={layers.filter((l) => l.name !== 'ABOVE_PLAYER') ?? []}
          className="-z-1 absolute left-0 top-0 border border-red-400"
          width={MAP_WIDTH * TILE_SIZE}
          height={MAP_HEIGHT * TILE_SIZE}
          MAP_WIDTH={MAP_WIDTH}
          TILE_SIZE={TILE_SIZE}
        />
        {/* <Application
            className="absolute left-0 top-0 "
            width={MAP_WIDTH * TILE_SIZE}
            height={MAP_HEIGHT * TILE_SIZE}
          >
            <MapTileList grounds={groundLayer?.data ?? []} MAP_WIDTH={MAP_WIDTH} TILE_SIZE={TILE_SIZE} tileImage={image} />
          </Application> */}

        {allEntities.map((entity) => {
          const entitiesOnSameTile = allEntities.filter((e) => e.x === entity.x && e.y === entity.y);
          const countOnTile = entitiesOnSameTile.length;

          const findSelf = entitiesOnSameTile.find((e) => e.id === heroId);
          const firstOnTile = findSelf ? findSelf : entitiesOnSameTile[0];
          if (firstOnTile.id !== entity.id && countOnTile > 1) return null;

          return (
            <MapEntityTile
              {...entity}
              key={entity.id}
              countOnTile={countOnTile}
              TILE_SIZE={TILE_SIZE}
              offsetX={offsetX}
              offsetY={offsetY}
            />
          );
        })}
        {movementPathTiles?.map((position) => (
          <MovablePathTile key={`${position.x}${position.y}`} {...position} TILE_SIZE={TILE_SIZE} offsetX={offsetX} offsetY={offsetY} />
        ))}
        <Canvas
          tileset={tileset}
          layers={layers.filter((l) => l.name === 'ABOVE_PLAYER') ?? []}
          className="absolute left-0 top-0 border border-red-400"
          width={MAP_WIDTH * TILE_SIZE}
          height={MAP_HEIGHT * TILE_SIZE}
          MAP_WIDTH={MAP_WIDTH}
          TILE_SIZE={TILE_SIZE}
        />
        {hoverIndexRef.current !== null && !isDragging && heroState === 'IDLE' && (
          <div
            ref={hoverRef}
            style={{
              position: 'absolute',
              width: TILE_SIZE,
              height: TILE_SIZE,
              backgroundColor: 'rgba(0,255,0,0.3)',
              pointerEvents: 'none',
              display: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
});

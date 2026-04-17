import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { Layer } from '@/shared/json-types';
import { Entrance, MapCreature, MapHero, StateType, TPlace } from '@/shared/types';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { Application } from '@pixi/react';
import { RefObject, memo, useEffect, useRef, useState } from 'react';

import { useDragOnMap } from '../hooks/useDragOnMap';
import { useSetHoverIndex } from '../hooks/useSetHoverIndex';
import { Canvas } from './Canvas';
import { LoadingMapSkeleton } from './LoadingMapSkeleton';
import { MapTileList } from './MapTileList';
import { CreatureTile } from './tile/CreatureTile';
import { EntranceTile } from './tile/EntranceTile';
import { HeroTile } from './tile/HeroTile';
import { MapTile } from './tile/MapTile';
import { MovablePathTile } from './tile/MovablePathTile';
import { PlaceTile } from './tile/PlaceTile';

interface Props {
  heroTargetX: number;
  heroTargetY: number;
  heroState: StateType;
  mapHeroes: MapHero[];
  mapCreatures: MapCreature[];
  places: TPlace[];
  entrances: Entrance[];
  tileWidth: number;
  height: number;
  width: number;
  image: string;
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

export const GameMap = memo(
  ({
    image,
    heroState,
    height,
    tileWidth,
    width,
    mapHeroes,
    mapCreatures,
    places,
    entrances,
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
  }: Props) => {
    const TILE_SIZE = tileWidth;
    const MAP_HEIGHT = height;
    const MAP_WIDTH = width;

    const isDraggingRef = useRef<boolean>(false);
    const [isDragging, setIsDragging] = useState(false);
    const hoverRef = useRef<HTMLDivElement | null>(null);
    const heroId = useHeroId();
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

    return (
      <div
        ref={(el) => {
          callbackRef(el);
          containerRef.current = el;
        }}
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
            key={image}
            grounds={groundLayer?.data ?? []}
            className="-z-1 absolute left-0 top-0 border border-red-400"
            width={MAP_WIDTH * TILE_SIZE}
            height={MAP_HEIGHT * TILE_SIZE}
            MAP_WIDTH={MAP_WIDTH}
            TILE_SIZE={TILE_SIZE}
            tileImage={image}
          />
          {/* <Application
            className="absolute left-0 top-0 "
            width={MAP_WIDTH * TILE_SIZE}
            height={MAP_HEIGHT * TILE_SIZE}
          >
            <MapTileList grounds={groundLayer?.data ?? []} MAP_WIDTH={MAP_WIDTH} TILE_SIZE={TILE_SIZE} tileImage={image} />
          </Application> */}
          {/* {groundLayer?.data.map((n, idx) => {
            const x = idx % MAP_WIDTH;
            const y = Math.floor(idx / MAP_WIDTH);
            const isChunkBorder = x % CHUNK_SIZE === 0 || y % CHUNK_SIZE === 0;
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
          })} */}

          {mapCreatures.map((creature) => {
            const firstCreature = mapCreatures[0];
            if (firstCreature.id !== creature.id && firstCreature.x === creature.x && firstCreature.y === creature.y) return;
            if (mapHeroes.some((h) => h.x === creature.x && h.y === creature.y)) return;
            const creatureCountInTile = mapCreatures.filter((c) => c.x === creature.x && c.y === creature.y).length;

            return (
              <CreatureTile
                key={creature.id}
                {...creature}
                creatureCountInTile={creatureCountInTile}
                TILE_SIZE={TILE_SIZE}
                offsetX={offsetX}
                offsetY={offsetY}
              />
            );
          })}
          {places.map((place) => (
            <PlaceTile key={place.id} {...place} TILE_SIZE={TILE_SIZE} offsetX={offsetX} offsetY={offsetY} />
          ))}
          {entrances.map((entrance) => (
            <EntranceTile
              key={entrance.id}
              x={entrance.x}
              y={entrance.y}
              image={entrance.image}
              TILE_SIZE={TILE_SIZE}
              offsetX={offsetX}
              offsetY={offsetY}
            />
          ))}
          {mapHeroes.map((hero) => {
            if (hero.id !== heroId && hero.x === heroWorldX && hero.y === heroWorldY) return;
            const heroCountInTile = mapHeroes.filter((h) => h.x === hero.x && h.y === hero.y).length;
            const creatureCountInTile = mapCreatures.filter((c) => c.x === hero.x && c.y === hero.y).length;
            return (
              <HeroTile
                key={hero.id}
                {...hero}
                heroCountInTile={heroCountInTile + creatureCountInTile}
                TILE_SIZE={TILE_SIZE}
                offsetX={offsetX}
                offsetY={offsetY}
              />
            );
          })}
          {movementPathTiles?.map((position) => (
            <MovablePathTile key={`${position.x}${position.y}`} {...position} TILE_SIZE={TILE_SIZE} offsetX={offsetX} offsetY={offsetY} />
          ))}

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
  },
);

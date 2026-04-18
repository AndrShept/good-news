import { useHero } from '@/features/hero/hooks/useHero';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { useEffect, useRef } from 'react';

import { useCenter } from '../hooks/useCenter';
import { useGameMap } from '../hooks/useGameMap';
import { useMapEntities } from '../hooks/useMapEntities';
import { useScaleMap } from '../hooks/useScaleMap';
import { EntitySidebar } from './EntitySidebar';
import { GameMap } from './GameMap';
import { HeroActionsBar } from './HeroActionsBar';
import { LoadingMapSkeleton } from './LoadingMapSkeleton';

export const GameMapLayout = () => {
  const hero = useHero((data) => ({
    x: data?.location?.x ?? 0,
    y: data?.location?.y ?? 0,
    targetX: data?.location?.targetX ?? 0,
    targetY: data?.location?.targetY ?? 0,
    mapId: data?.location?.mapId ?? '',
    chunkId: data?.location?.chunkId ?? '',
    state: data?.state ?? 'IDLE',
    gatheringFinishAt: data?.gatheringFinishAt ?? 0,
  }));
  const { mapEntities, isLoading, heroesAtPosition, corpsesAtPosition, creaturesAtPosition } = useMapEntities();
  const map = useGameMap({ mapId: hero.mapId, chunkId: hero.chunkId });

  const heroWorldX = hero.x;
  const heroWorldY = hero.y;

  const offsetX = map.data?.offsetX ?? 0;
  const offsetY = map.data?.offsetY ?? 0;

  const heroLocalX = heroWorldX - offsetX;
  const heroLocalY = heroWorldY - offsetY;

  const { scale, callbackRef, containerRef } = useScaleMap();
  const clearMovementPathTiles = useMovementPathTileStore((state) => state.clearMovementPathTiles);
  const { onCenter } = useCenter({
    TILE_SIZE: map.data?.tileWidth,
    containerRef,
    heroPosX: heroLocalX,
    heroPosY: heroLocalY,
    scale,
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current && !!map.data?.layers) {
      isFirstRender.current = false;
      onCenter({ behavior: 'instant' });
      return;
    }

    onCenter({ behavior: 'smooth' });
  }, [map.data?.layers]);

  useEffect(() => {
    return () => {
      clearMovementPathTiles();
    };
  }, [hero.mapId]);

  return (
    <section className="flex w-full flex-col gap-2 p-1 sm:flex-row">
      <aside className="flex w-full gap-2 sm:max-w-[150px] sm:flex-col">
        <HeroActionsBar
          onCenter={() => onCenter({ behavior: 'smooth' })}
          heroPosX={hero.x}
          heroPosY={hero.y}
          map={map.data}
          gatheringFinishAt={hero.gatheringFinishAt}
          state={hero.state}
        />
        <EntitySidebar
          mode="MAP"
          creatures={creaturesAtPosition}
          corpses={corpsesAtPosition}
          heroes={heroesAtPosition}
          isLoading={isLoading}
        />
      </aside>

      {map.isLoading ? (
        <LoadingMapSkeleton />
      ) : (
        <GameMap
          scale={scale}
          containerRef={containerRef}
          callbackRef={callbackRef}
          width={map.data?.width ?? 0}
          height={map.data?.height ?? 0}
          tileWidth={map.data?.tileWidth ?? 32}
          heroWorldX={heroWorldX}
          heroWorldY={heroWorldY}
          heroLocalX={heroLocalX}
          heroLocalY={heroLocalY}
          heroTargetX={hero.targetX}
          heroTargetY={hero.targetY}
          heroState={hero.state}
          tileset={map.data?.tileset ?? []}
          layers={map.data?.layers ?? []}
          mapHeroes={mapEntities?.heroes ?? []}
          mapCreatures={mapEntities?.creatures ?? []}
          places={map.data?.places ?? []}
          entrances={map.data?.entrances ?? []}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      )}
    </section>
  );
};

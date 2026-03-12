import { useHero } from '@/features/hero/hooks/useHero';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useMemo, useRef } from 'react';

import { getMapChunkEntitiesOptions } from '../api/get-map-heroes';
import { useCenter } from '../hooks/useCenter';
import { useGameMap } from '../hooks/useGameMap';
import { useScaleMap } from '../hooks/useScaleMap';
import { GameMap } from './GameMap';
import { HeroActionsBar } from './HeroActionsBar';
import { HeroSidebarList } from './HeroSidebarList';

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
  const { data: mapEntities, isLoading } = useQuery(getMapChunkEntitiesOptions(hero.mapId));

  const map = useGameMap({ mapId: hero.mapId, chunkId: hero.chunkId });

  const heroWorldX = hero.x;
  const heroWorldY = hero.y;

  const offsetX = map.data?.offsetX ?? 0;
  const offsetY = map.data?.offsetY ?? 0;

  const heroLocalX = heroWorldX - offsetX;
  const heroLocalY = heroWorldY - offsetY;
  const heroesAtPosition = useMemo(
    () => mapEntities?.heroes.filter((h) => h.x === heroWorldX && h.y === heroWorldY),
    [heroWorldX, heroWorldY, mapEntities?.heroes],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const { scale } = useScaleMap(containerRef);

  const { onCenter } = useCenter({
    TILE_SIZE: map.data?.tileWidth,
    containerRef,
    heroPosX: heroLocalX,
    heroPosY: heroLocalY,
    scale,
  });
  useEffect(() => {
    if (!containerRef.current) return;
    onCenter();

  }, [map.data?.layers]);

  return (
    <section className="flex w-full flex-col-reverse gap-2 p-1 sm:flex-row">
      <aside className="flex w-full gap-2 sm:max-w-[150px] sm:flex-col">
        <HeroActionsBar
          onCenter={onCenter}
          heroPosX={hero.x}
          heroPosY={hero.y}
          map={map.data}
          gatheringFinishAt={hero.gatheringFinishAt}
          state={hero.state}
        />
        <HeroSidebarList heroes={heroesAtPosition} isLoading={isLoading} />
      </aside>

      <div className="relative aspect-video w-full overflow-hidden">
        <Suspense fallback={'LOADING MAP....'}>
          <GameMap
            scale={scale}
            containerRef={containerRef}
            width={map.data?.width ?? 0}
            height={map.data?.height ?? 0}
            layers={map.data?.layers ?? []}
            image={map.data?.image ?? ''}
            tileWidth={map.data?.tileWidth ?? 32}
            isLoading={map.isLoading}
            heroWorldX={heroWorldX}
            heroWorldY={heroWorldY}
            heroLocalX={heroLocalX}
            heroLocalY={heroLocalY}
            heroTargetX={hero.targetX}
            heroTargetY={hero.targetY}
            heroState={hero.state}
            mapHeroes={mapEntities?.heroes}
            places={map.data?.places}
            entrances={map.data?.entrances}
            offsetX={offsetX}
            offsetY={offsetY}
          />
        </Suspense>
      </div>
    </section>
  );
};

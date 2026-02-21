import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getMapHeroesLocationOptions } from '../api/get-map-heroes';
import { useGameMap } from '../hooks/useGameMap';
import { GameMap } from './GameMap';
import { HeroActionsBar } from './HeroActionsBar';
import { HeroSidebarList } from './HeroSidebarList';
import { MovingPanel } from './MovingPanel';

export const GameMapLayout = () => {
  const hero = useHero((data) => ({
    x: data?.location?.x ?? 0,
    y: data?.location?.y ?? 0,
    targetX: data?.location?.targetX ?? 0,
    targetY: data?.location?.targetY ?? 0,
    mapId: data?.location?.mapId ?? '',
    state: data?.state ?? 'IDLE',
    gatheringFinishAt: data?.gatheringFinishAt ?? 0,
  }));
  const { data: mapHeroes, isLoading } = useQuery(getMapHeroesLocationOptions(hero.mapId));

  const map = useGameMap({ mapId: hero.mapId });

  const heroesAtPosition = useMemo(() => mapHeroes?.filter((p) => p.x === hero.x && p.y === hero.y), [hero.x, hero.y, mapHeroes]);

  return (
    <section className="flex w-full flex-col gap-2 p-1 sm:flex-row">
      <aside className="flex w-full sm:max-w-[150px] gap-2 sm:flex-col">
        <HeroActionsBar heroPosX={hero.x} heroPosY={hero.y} map={map.data} gatheringFinishAt={hero.gatheringFinishAt} state={hero.state} />
        <HeroSidebarList heroes={heroesAtPosition} isLoading={isLoading} />
      </aside>
      <div className="relative aspect-video w-full overflow-hidden">
        <MovingPanel heroState={hero.state} />
        {/* {hero.state !== 'IDLE' && !!hero.gatheringFinishAt && (
          <GatheringPanel heroState={hero.state} gatheringFinishAt={hero.gatheringFinishAt} />
        )} */}
        <GameMap
          width={map.data?.width ?? 0}
          height={map.data?.height ?? 0}
          layers={map.data?.layers ?? []}
          image={map.data?.image ?? ''}
          tileWidth={map.data?.tileWidth ?? 32}
          isLoading={map.isLoading}
          heroPosX={hero.x}
          heroPosY={hero.y}
          heroTargetX={hero.targetX}
          heroTargetY={hero.targetY}
          heroState={hero.state}
          mapHeroes={mapHeroes}
          places={map.data?.places}
          entrances={map.data?.entrances}
        />
      </div>
    </section>
  );
};

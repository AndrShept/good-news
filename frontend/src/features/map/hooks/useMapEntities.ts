import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getMapChunkEntitiesOptions } from '../api/get-map-heroes';

export const useMapEntities = () => {
  const hero = useHero((data) => ({
    mapId: data?.location.mapId ?? '',
    x: data?.location.x,
    y: data?.location.y,
  }));
  const { data: mapEntities, isLoading } = useQuery(getMapChunkEntitiesOptions(hero.mapId));

  const heroesAtPosition = useMemo(
    () => mapEntities?.heroes.filter((h) => h.x === hero.x && h.y === hero.y),
    [hero.x, hero.y, mapEntities?.heroes],
  );
  const creaturesAtPosition = useMemo(
    () => mapEntities?.creatures.filter((c) => c.x === hero.x && c.y === hero.y),
    [hero.x, hero.y, mapEntities?.creatures],
  );
  const corpsesAtPosition = useMemo(
    () => mapEntities?.corpses.filter((c) => c.x === hero.x && c.y === hero.y),
    [hero.x, hero.y, mapEntities?.corpses],
  );

  return {
    mapEntities,
    isLoading,
    heroesAtPosition,
    creaturesAtPosition,
    corpsesAtPosition,
  };
};

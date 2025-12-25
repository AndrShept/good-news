import { getMapHeroesLocationOptions } from '@/features/map/api/get-map-heroes';
import { useMap } from '@/features/map/hooks/useMap';
import { getTilesAroundHero } from '@/lib/utils';
import { IPosition } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { useHero } from './useHero';

export const useHeroActions = () => {
  const hero = useHero((data) => ({
    mapId: data?.location?.mapId ?? '',
    x: data?.location?.x ?? 0,
    y: data?.location?.y ?? 0,
  }));
  const map = useMap({ mapId: hero.mapId });

  const { data: heroesAtHeroPos } = useQuery({
    ...getMapHeroesLocationOptions(hero.mapId),
    select: (data) => data?.filter((l) => l.x === hero.x && l.y === hero.y),
  });

  const MAP_WIDTH = map?.width ?? 0;

  const layersByName = useMemo(() => {
    if (!map?.layers) return {};
    return map.layers.reduce<Record<string, (typeof map.layers)[number]>>((acc, layer) => {
      acc[layer.name] = layer;
      return acc;
    }, {});
  }, [map?.layers]);

  const [movedTiles, setMovedTiles] = useState<null | IPosition[]>(null);

  const isHeroOnTownTile = useMemo(() => {
    return map?.places?.some((town) => {
      return town.x === hero.x && town.y === hero.y;
    });
  }, [hero.x, hero.y, map?.places]);

  const canFish = useMemo(() => {
    const around = getTilesAroundHero({ x: hero.x, y: hero.y }, 1);
    const water = layersByName['WATER']?.data;
    return around.some((pos) => water?.[pos.y * MAP_WIDTH + pos.x]);
  }, [MAP_WIDTH, hero.x, hero.y, layersByName]);

  useEffect(() => {
    const around = getTilesAroundHero({ x: hero.x, y: hero.y }, 2).filter((t) => {
      const index = t.y * MAP_WIDTH + t.x;
      const ground = layersByName['GROUND']?.data?.[index];
      const water = layersByName['WATER']?.data?.[index];
      const object = layersByName['OBJECT']?.data?.[index];
      return (ground || ground !== 0) && !water && !object;
    });
    setMovedTiles(around);
  }, [MAP_WIDTH, hero.x, hero.y, layersByName]);

  return {
    movedTiles,
    canFish,
    isHeroOnTownTile,
    heroesAtHeroPos,
  };
};

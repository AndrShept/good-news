import { useMap } from '@/features/map/hooks/useMap';
import { getTilesAroundHero } from '@/lib/utils';
import { IPosition, Tile } from '@/shared/types';
import { useLayoutEffect, useMemo, useState } from 'react';

import { useHero } from './useHero';

export const useHeroActions = () => {
  const hero = useHero((state) => ({
    mapId: state?.data?.location?.tile?.mapId ?? '',
    x: state?.data?.location?.tile?.x ?? 0,
    y: state?.data?.location?.tile?.y ?? 0,
  }));
  const map = useMap({ mapId: hero.mapId });
  const tilesByPos = useMemo(() => {
    if (!map?.tiles?.length) return {};

    return map.tiles.reduce(
      (acc, tile) => {
        acc[`${tile.x}-${tile.y}`] = tile;
        return acc;
      },
      {} as Record<string, Tile>,
    );
  }, [map]);
  const [movedTiles, setMovedTiles] = useState<null | IPosition[]>(null);

  const isCanFishing = useMemo(() => {
    const around = getTilesAroundHero({ x: hero.x, y: hero.y }, 1);
    return around.some((pos) => {
      const tile = tilesByPos[`${pos.x}-${pos.y}`];
      return tile?.type === 'WATER';
    });
  }, [hero.x, hero.y, tilesByPos]);


  useLayoutEffect(() => {
    const around = getTilesAroundHero({ x: hero.x, y: hero.y }, 1).filter(
      (pos) => tilesByPos[`${pos.x}-${pos.y}`]?.type !== 'WATER' && tilesByPos[`${pos.x}-${pos.y}`]?.type !== 'OBJECT',
    );
    setMovedTiles(around);
  }, [hero.x, hero.y, tilesByPos]);

  return {
    movedTiles,
    isCanFishing,
  };
};

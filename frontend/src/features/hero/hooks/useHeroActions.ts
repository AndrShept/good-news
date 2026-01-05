import { getTilesAroundHero } from '@/lib/utils';
import { TMap } from '@/shared/types';
import { useMemo } from 'react';

interface Props {
  heroPosX: number;
  heroPosY: number;
  map: TMap | undefined;
}

export const useHeroActions = ({ heroPosX, heroPosY, map }: Props) => {
  const MAP_WIDTH = map?.width ?? 0;

  const layersByName = useMemo(() => {
    if (!map?.layers) return {};
    return map.layers.reduce<Record<string, (typeof map.layers)[number]>>((acc, layer) => {
      acc[layer.name] = layer;
      return acc;
    }, {});
  }, [map]);

  const isHeroOnTownTile = useMemo(() => {
    return map?.places?.some((town) => {
      return town.x === heroPosX && town.y === heroPosY;
    });
  }, [heroPosX, heroPosY, map?.places]);

  const canFish = useMemo(() => {
    const around = getTilesAroundHero({ x: heroPosX, y: heroPosY }, 1);
    const water = layersByName['WATER']?.data;
    return around.some((pos) => water?.[pos.y * MAP_WIDTH + pos.x]);
  }, [MAP_WIDTH, heroPosX, heroPosY, layersByName]);

  return {
    canFish,
    isHeroOnTownTile,
  };
};

import { TMap } from '@/shared/types';
import { getMapLayerNameAtHeroPos, getTilesAroundHero } from '@/shared/utils';
import { useMemo } from 'react';

interface Props {
  heroPosX: number;
  heroPosY: number;
  map: TMap | undefined;
}

export const useHeroActions = ({ heroPosX, heroPosY, map }: Props) => {
  // const MAP_WIDTH = map?.width ?? 0;

  // const layersByName = useMemo(() => {
  //   if (!map?.layers) return {};
  //   return map.layers.reduce<Record<string, (typeof map.layers)[number]>>((acc, layer) => {
  //     acc[layer.name] = layer;
  //     return acc;
  //   }, {});
  // }, [map]);

  const placeTile = useMemo(() => {
    return map?.places?.find((place) => {
      return place.x === heroPosX && place.y === heroPosY;
    });
  }, [heroPosX, heroPosY, map?.places]);
  const entranceTile = useMemo(() => {
    return map?.entrances?.find((entrance) => {
      return entrance.x === heroPosX && entrance.y === heroPosY;
    });
  }, [heroPosX, heroPosY, map?.entrances]);

  // const canFish = useMemo(() => {
  //   const around = getTilesAroundHero({ x: heroPosX, y: heroPosY }, 1);
  //   const water = layersByName['WATER']?.data;
  //   return around.some((pos) => water?.[pos.y * MAP_WIDTH + pos.x]);
  // }, [MAP_WIDTH, heroPosX, heroPosY, layersByName]);

  const gatheringTiles = useMemo(() => {
    const tiles = getMapLayerNameAtHeroPos(map?.id, { x: heroPosX, y: heroPosY });
    return tiles;
  }, [heroPosX, heroPosY, map?.id]);

  return {
    placeTile,
    entranceTile,
    gatheringTiles,
  };
};

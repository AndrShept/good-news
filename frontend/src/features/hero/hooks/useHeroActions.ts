import { TMap } from '@/shared/types';
import { useMemo } from 'react';

interface Props {
  heroPosX: number;
  heroPosY: number;
  map: TMap | undefined;
}

export const useHeroActions = ({ heroPosX, heroPosY, map }: Props) => {


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




  return {
    placeTile,
    entranceTile,
    
  };
};

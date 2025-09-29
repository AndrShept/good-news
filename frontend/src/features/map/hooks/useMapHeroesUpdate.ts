import { IPosition, Location} from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getMapHeroesLocationOptions } from '../api/get-map-heroes';

export const useMapHeroesUpdate = (mapId: string) => {
  const queryClient = useQueryClient();

  const updateHeroesPos = useCallback(
    (heroId: string, position: IPosition) => {
      queryClient.setQueriesData<Location[]>({ queryKey: getMapHeroesLocationOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;
        return oldData.map((location) => (location.heroId === heroId ? { ...location, ...position } : location));
      });
    },
    [mapId, queryClient],
  );
  const deleteHeroes = useCallback(
    (heroId: string) => {
      queryClient.setQueriesData<Location[]>({ queryKey: getMapHeroesLocationOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;

        return oldData.filter((location) => location.heroId !== heroId);
      });
    },
    [mapId, queryClient],
  );

  const addHeroes = useCallback(
    (heroLocation: Location) => {
      queryClient.setQueriesData<Location[]>({ queryKey: getMapHeroesLocationOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;
        return [...oldData, heroLocation];
      });
    },
    [mapId, queryClient],
  );

  return {
    updateHeroesPos,
    deleteHeroes,
    addHeroes,
  };
};

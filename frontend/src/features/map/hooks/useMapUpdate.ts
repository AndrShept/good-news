import { IPosition, Location, Map, MapNameType, Tile } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getMapOptions } from '../api/get-map';

export const useMapUpdate = (mapId: string) => {
  const queryClient = useQueryClient();

  const updateMap = useCallback(
    ({ params }: { params: Partial<Map> }) => {
      queryClient.setQueriesData<Map>({ queryKey: getMapOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;
        return { ...oldData, ...params };
      });
    },
    [mapId, queryClient],
  );

  const updateMapHeroes = useCallback(
    (heroId: string, position: IPosition) => {
      queryClient.setQueriesData<Map>({ queryKey: getMapOptions(mapId).queryKey }, (oldData) => {
        if (!oldData?.heroesLocation) return;
        return {
          ...oldData,
          heroesLocation: oldData.heroesLocation.map((location) => (location.heroId === heroId ? { ...location, ...position } : location)),
        };
      });
    },
    [mapId, queryClient],
  );
  const deleteMapHeroes = useCallback(
    (heroId: string) => {
      queryClient.setQueriesData<Map>({ queryKey: getMapOptions(mapId).queryKey }, (oldData) => {
        if (!oldData?.heroesLocation) return;
        return {
          ...oldData,
          heroesLocation: oldData.heroesLocation.filter((location) => location.heroId !== heroId),
        };
      });
    },
    [mapId, queryClient],
  );

  const addMapHeroes = useCallback(
    (heroLocation: Location) => {
      queryClient.setQueriesData<Map>({ queryKey: getMapOptions(mapId).queryKey }, (oldData) => {
        if (!oldData?.heroesLocation) return;
        return { ...oldData, heroesLocation: [...oldData.heroesLocation, heroLocation] };
      });
    },
    [mapId, queryClient],
  );

  return {
    updateMap,
    updateMapHeroes,
    deleteMapHeroes,
    addMapHeroes,
  };
};

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getPlaceHeroesLocationOptions } from '../api/get-place-heroes';
import { Location } from '@/shared/types';

export const useTownHeroesUpdate = (placeId: string) => {
  const queryClient = useQueryClient();

  const deleteHeroes = useCallback(
    (heroId: string) => {
      queryClient.setQueriesData<Location[]>({ queryKey: getPlaceHeroesLocationOptions(placeId).queryKey }, (oldData) => {
        if (!oldData) return;

        return oldData.filter((location) => location.heroId !== heroId);
      });
    },
    [placeId],
  );

  const addHeroes = useCallback(
    (heroLocation: Location) => {
      queryClient.setQueriesData<Location[]>({ queryKey: getPlaceHeroesLocationOptions(placeId).queryKey }, (oldData) => {
        if (!oldData) return;
        if (oldData.some((location) => location.id === heroLocation.id)) return;

        return [...oldData, heroLocation];
      });
    },
    [placeId],
  );

  return {
    deleteHeroes,
    addHeroes,
  };
};

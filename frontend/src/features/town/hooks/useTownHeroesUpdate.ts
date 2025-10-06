import { Location } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getTownHeroesLocationOptions } from '../api/get-town-heroes';

export const useTownHeroesUpdate = (townId: string) => {
  const queryClient = useQueryClient();

  const deleteHeroes = useCallback(
    (heroId: string) => {
      queryClient.setQueriesData<Location[]>({ queryKey: getTownHeroesLocationOptions(townId).queryKey }, (oldData) => {
        if (!oldData) return;

        return oldData.filter((location) => location.heroId !== heroId);
      });
    },
    [townId],
  );

  const addHeroes = useCallback(
    (heroLocation: Location) => {
      queryClient.setQueriesData<Location[]>({ queryKey: getTownHeroesLocationOptions(townId).queryKey }, (oldData) => {
        if (!oldData) return;
        if (oldData.some((location) => location.id === heroLocation.id)) return;

        return [...oldData, heroLocation];
      });
    },
    [townId],
  );

  return {
    deleteHeroes,
    addHeroes,
  };
};

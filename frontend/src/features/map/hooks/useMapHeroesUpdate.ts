import { ApiGetMapHeroes, MapHero } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getMapHeroesLocationOptions } from '../api/get-map-heroes';

export const useMapHeroesUpdate = (mapId: string) => {
  const queryClient = useQueryClient();

  const updateHeroesPos = useCallback(
    (heroId: string, data: Partial<MapHero>) => {
      queryClient.setQueriesData<ApiGetMapHeroes>({ queryKey: getMapHeroesLocationOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;
        return oldData.map((h) => (heroId === h.id ? { ...h, ...data } : h));
      });
    },
    [mapId],
  );
  const deleteHeroes = useCallback(
    (heroId: string) => {
      queryClient.setQueriesData<ApiGetMapHeroes>({ queryKey: getMapHeroesLocationOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;

        return oldData.filter((h) => h.id !== heroId);
      });
    },
    [mapId],
  );

  const addHeroes = useCallback(
    (hero: MapHero) => {
      queryClient.setQueriesData<ApiGetMapHeroes>({ queryKey: getMapHeroesLocationOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;
        if (oldData.some((h) => h.id === hero.id)) return;

        return [...oldData, hero];
      });
    },
    [mapId],
  );

  return {
    updateHeroesPos,
    deleteHeroes,
    addHeroes,
  };
};

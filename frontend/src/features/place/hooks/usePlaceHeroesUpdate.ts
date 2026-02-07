import { ApiGetPlaceHeroes, HeroSidebarItem } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getPlaceHeroesLocationOptions } from '../api/get-place-heroes';

export const usePlaceHeroesUpdate = (placeId: string) => {
  const queryClient = useQueryClient();

  const removeHeroes = useCallback(
    (heroId: string) => {
      queryClient.setQueriesData<ApiGetPlaceHeroes>({ queryKey: getPlaceHeroesLocationOptions(placeId).queryKey }, (oldData) => {
        if (!oldData) return;

        return oldData.filter((h) => h.id !== heroId);
      });
    },
    [placeId],
  );
  const updateHeroes = useCallback(
    (heroId: string, data: Partial<HeroSidebarItem>) => {
      queryClient.setQueriesData<ApiGetPlaceHeroes>({ queryKey: getPlaceHeroesLocationOptions(placeId).queryKey }, (oldData) => {
        if (!oldData) return;

        return oldData.map((h) => (h.id === heroId ? { ...h, ...data } : h));
      });
    },
    [placeId],
  );

  const addHeroes = useCallback(
    (hero: HeroSidebarItem) => {
      queryClient.setQueriesData<ApiGetPlaceHeroes>({ queryKey: getPlaceHeroesLocationOptions(placeId).queryKey }, (oldData) => {
        if (!oldData) return;
        if (oldData.some((h) => h.id === hero.id)) return;

        return [...oldData, hero];
      });
    },
    [placeId],
  );

  return {
    removeHeroes,
    addHeroes,
    updateHeroes,
  };
};

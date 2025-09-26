import { ApiHeroResponse, Hero, Tile } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getHeroOptions } from '../api/get-hero';

export type OmitDeepHero = Omit<Partial<Hero>, 'location' | 'state' | 'action' | 'group'> & {
  location?: Partial<Hero['location']>;
  action?: Partial<Hero['action']>;
  group?: Partial<Hero['group']>;
  state?: Partial<Hero['state']>;
};

export const useHeroUpdate = () => {
  const queryClient = useQueryClient();

  const updateHero = useCallback(
    (data: OmitDeepHero) => {
      queryClient.setQueriesData<ApiHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
        if (!oldData?.data) return;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...data,
            action: { ...oldData.data.action, ...data.action },
            state: { ...oldData.data.state, ...data.state },
            location: {
              ...oldData.data.location,
              ...data.location,
              tile: {
                ...oldData.data.location?.tile,
                ...data.location?.tile,
              },
            },
            group: { ...oldData.data.group, ...data.group },
          },
        } as ApiHeroResponse;
      });
    },
    [queryClient],
  );

  const updateHeroTile = useCallback(
    (data: Partial<Tile>) => {
      queryClient.setQueriesData<ApiHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
        if (!oldData?.data) return;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            location: {
              ...oldData.data.location,
              tile: { ...oldData.data.location?.tile, ...data },
            },
          },
        } as ApiHeroResponse;
      });
    },
    [queryClient],
  );

  return { updateHero, updateHeroTile };
};

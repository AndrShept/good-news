import { ApiHeroResponse, Hero, IPosition } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getHeroOptions } from '../api/get-hero';

export type OmitDeepHero = Omit<Partial<Hero>, 'location' | 'state' | 'action' | 'group'> & {
  location?: Partial<Hero['location']>;
  action?: Partial<Hero['action']>;
  group?: Partial<Hero['group']>;
  state?: Partial<Hero['state']>;
};

export const useHeroChange = () => {
  const queryClient = useQueryClient();

  const heroChange = useCallback(
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
            location: { ...oldData.data.location, ...data.location },
            group: { ...oldData.data.group, ...data.group },
          },
        } as ApiHeroResponse;
      });
    },
    [queryClient],
  );

  const heroChangePos = useCallback(
    (pos: IPosition) => {
      queryClient.setQueriesData<ApiHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
        if (!oldData?.data) return;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            location: {
              ...oldData.data.location,
              tile: { ...oldData.data.location?.tile, ...pos },
            },
          },
        } as ApiHeroResponse;
      });
    },
    [queryClient],
  );

  return { heroChange, heroChangePos };
};

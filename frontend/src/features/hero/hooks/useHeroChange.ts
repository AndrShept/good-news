import { ApiHeroResponse, Hero } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';

export type OmitDeepHero = Omit<Partial<Hero>, 'location' | 'state' | 'action' | 'group' | 'tile'> & {
  location?: Partial<Hero['location']>;
  action?: Partial<Hero['action']>;
  group?: Partial<Hero['group']>;
  state?: Partial<Hero['state']>;
  tile?: Partial<Hero['tile']>;
};

export const useHeroChange = () => {
  const queryClient = useQueryClient();

  const heroChange = (data: OmitDeepHero) => {
    queryClient.setQueriesData<ApiHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
      if (!oldData || !oldData.data) return;

      return {
        ...oldData,
        data: {
          ...oldData.data,
          ...data,
          action: { ...oldData.data.action, ...data.action },
          state: { ...oldData.data.state, ...data.state },
          location: { ...oldData.data.location, ...data.location },
          group: { ...oldData.data.group, ...data.group },
          tile: { ...oldData.data.tile, ...data.tile },
        },
      } as ApiHeroResponse;
    });
  };
  return {
    heroChange,
  };
};

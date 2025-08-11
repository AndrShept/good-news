import { ApiHeroResponse, Hero } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';

export type OmitDeepHero = Omit<Partial<Hero>, 'location' | 'state' | 'action' | 'group'> & {
  location?: Partial<Hero['location']>;
  state?: Partial<Hero['state']>;
  action?: Partial<Hero['action']>;
  group?: Partial<Hero['group']>;
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
        },
      } as ApiHeroResponse;
    });
  };
  return {
    heroChange,
  };
};

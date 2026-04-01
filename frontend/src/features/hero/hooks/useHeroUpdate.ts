import { ApiGetHeroResponse, Hero } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getHeroOptions } from '../api/get-hero';


export type OmitDeepHero = {
  location?: Partial<ApiGetHeroResponse['location']>;
  group?: Partial<ApiGetHeroResponse['group']>;
  regen?: Partial<ApiGetHeroResponse['regen']>;
} & Omit<Partial<ApiGetHeroResponse>, 'location' | 'group' | 'regen'>;

export const useHeroUpdate = () => {
  const queryClient = useQueryClient();

  const updateHero = useCallback((data: OmitDeepHero) => {
    queryClient.setQueriesData<ApiGetHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
      if (!oldData) return;
      return {
        ...oldData,

        ...data,

        location: {
          ...oldData.location,
          ...data.location,
        },
        group: { ...oldData.group, ...data.group },
        regen: { ...oldData.regen, ...data.regen },
      };
    });
  }, []);

  return { updateHero };
};

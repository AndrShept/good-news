import { Hero } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getHeroOptions } from '../api/get-hero';

export type OmitDeepHero = Omit<Partial<Hero>, 'location' | 'group' | 'regen'> & {
  location?: Partial<Hero['location']>;
  group?: Partial<Hero['group']>;
  regen?: Partial<Hero['regen']>;
};

export const useHeroUpdate = () => {
  const queryClient = useQueryClient();

  const updateHero = useCallback((data: OmitDeepHero) => {
    queryClient.setQueriesData<Hero>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
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

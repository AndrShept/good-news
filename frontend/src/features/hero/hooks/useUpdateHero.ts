import { ApiHeroResponse, Hero } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';

export const useUpdateHero = () => {
  const queryClient = useQueryClient();
  const updateHero = (params: Partial<Hero>) => {
    queryClient.setQueriesData<ApiHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
      if (!oldData || !oldData.data) {
        return;
      }
      return {
        ...oldData,
        data: { ...oldData.data, ...params },
      };
    });
  };

  return { updateHero };
};

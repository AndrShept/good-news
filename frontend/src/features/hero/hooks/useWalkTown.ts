import { client, toastError } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { useHeroId } from './useHeroId';
import { BuildingType } from '@/shared/types';

export const useWalkPlace = () => {
  const id = useHeroId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (buildingType: BuildingType) => {
      const res = await client.hero[':id'].action['walk-place'].$post({
        param: {
          id,
        },
        json: {
          buildingType,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getHeroOptions().queryKey });
    },
  });
};

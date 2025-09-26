import { client, toastError } from '@/lib/utils';
import { buildingNameType } from '@/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { useHeroId } from './useHeroId';

export const useWalkTown = () => {
  const id = useHeroId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (buildingName: buildingNameType) => {
      const res = await client.hero[':id'].action['walk-town'].$post({
        param: {
          id,
        },
        json: {
          buildingName,
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

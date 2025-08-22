import { client, toastError } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { useHeroId } from './useHeroId';
import { buildingNameType } from '@/shared/types';

export const useWalkTown = () => {
  const id = useHeroId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (buildingName:buildingNameType) =>
      client.hero[':id'].action['walk-town'].$post({
        param: {
          id,
        },
        json: {
          buildingName,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getHeroOptions().queryKey });
    },
  });
};

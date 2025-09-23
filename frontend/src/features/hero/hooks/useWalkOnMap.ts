import { client } from '@/lib/utils';
import { IPosition } from '@/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { useHeroId } from './useHeroId';

export const useWalkOnMap = () => {
  const id = useHeroId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPos: IPosition) =>
      client.hero[':id'].action['walk-map'].$post({
        param: {
          id,
        },
        json: newPos,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getHeroOptions().queryKey });
    },
  });
};

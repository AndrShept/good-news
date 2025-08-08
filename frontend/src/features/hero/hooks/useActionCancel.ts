import { client } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { useHeroId } from './useHeroId';

export const useActionCancel = () => {
  const id = useHeroId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      client.hero[':id'].action.cancel.$post({
        param: {
          id,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getHeroOptions().queryKey });
    },
  });
};

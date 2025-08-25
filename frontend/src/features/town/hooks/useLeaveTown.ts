import { useHeroId } from '@/features/hero/hooks/useHeroId'
import { client } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLeaveTown = () => {
  const id = useHeroId();
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async() =>
      client.hero[':id'].action['leave-town'].$post({
        param: {
          id,
        },
      }),
  });
};

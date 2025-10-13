import { useHeroId } from '@/features/hero/hooks/useHeroId'
import { client } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLeavePlace = () => {
  const id = useHeroId();
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async() =>
      client.hero[':id'].action['leave-place'].$post({
        param: {
          id,
        },
      }),
  });
};

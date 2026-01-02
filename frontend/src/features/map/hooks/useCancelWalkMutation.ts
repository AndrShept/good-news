import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { client } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

export const useCancelWalkMutation = () => {
  const heroId = useHeroId();
  return useMutation({
    mutationFn: async () => {
      const res = await client.hero[':id'].action['walk-map'].cancel.$post({
        param: {
          id: heroId,
        },
      });
      return res.json();
    },
  });
};

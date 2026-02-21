import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { client } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

export const useCancelGatheringMutation = () => {
  const heroId = useHeroId();
  const { updateHero } = useHeroUpdate();
  return useMutation({
    mutationFn: async () => {
      const res = await client.hero[':id'].gather.cancel.$post({
        param: {
          id: heroId,
        },
      });
      return res.json();
    },
    onSuccess() {
      updateHero({
        state: 'IDLE',
        gatheringFinishAt: null,
      });
    },
  });
};

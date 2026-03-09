import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { client } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

export const useLeavePlace = () => {
  const id = useHeroId();
  const { updateHero } = useHeroUpdate();
  return useMutation({
    mutationFn: async () => {
      const data = await client.hero[':id'].action['leave-place'].$post({
        param: {
          id,
        },
      });
      return data.json();
    },
    onSuccess({ data }) {
      updateHero({ location: data });
    },
  });
};

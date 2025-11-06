import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { useUpdateHero } from '@/features/hero/hooks/useUpdateHero';
import { client } from '@/lib/utils';
import { ErrorResponse, ResourceType } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

export const useDeleteQueueCraftItemMutation = () => {
  const id = useHeroId();
  const { deleteCraftItemsQueue } = useHeroUpdate();
  return useMutation({
    mutationFn: async (queueCraftItemId: string) => {
      const res = await client.hero[':id'].action['queue-craft'][':queueCraftItemId'].$delete({
        param: {
          id,
          queueCraftItemId,
        },
      });
      if (!res.ok) {
        const err = (await res.json()) as unknown as ErrorResponse;
        throw new Error(err.message, { cause: { canShow: err.canShow } });
      }
      return await res.json();
    },
    onSuccess: (_, queueCraftItemId) => {
      deleteCraftItemsQueue(queueCraftItemId);
    },
  });
};

import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useQueueCraftItem } from './useQueueCraftItem';

export const useDeleteQueueCraftItemMutation = () => {
  const id = useHeroId();
  const { removeQueueCraftItems } = useQueueCraftItem();
  return useMutation({
    mutationFn: async ({ queueCraftItemId }: { queueCraftItemId: string }) => {
      const res = await client.hero[':id']['queue-craft'][':queueCraftItemId'].$delete({
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
    onSuccess: (_, { queueCraftItemId }) => {
      removeQueueCraftItems(queueCraftItemId);
    },
  });
};

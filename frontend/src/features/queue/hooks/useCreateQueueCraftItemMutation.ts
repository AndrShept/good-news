import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useQueueCraftItem } from './useQueueCraftItem';

export const useCreateQueueCraftItemMutation = () => {
  const id = useHeroId();

  const { setQueueCraftItems } = useQueueCraftItem();
  return useMutation({
    mutationFn: async ({ recipeId, coreResourceId }: { recipeId: string; coreResourceId: string | undefined }) => {
      const res = await client.hero[':id']['queue-craft']['add'].$post({
        param: {
          id,
        },
        json: {
          recipeId,
          coreResourceId,
        },
      });
      if (!res.ok) {
        const err = (await res.json()) as unknown as ErrorResponse;
        throw new Error(err.message, { cause: { canShow: err.canShow } });
      }
      return await res.json();
    },
    onSuccess: ({ data }) => {

      setQueueCraftItems(data);
    },
  });
};

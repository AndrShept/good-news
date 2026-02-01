import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getQueueCraftItemOptions } from '../api/getQueueCraftItems';
import { useQueueCraftItem } from './useQueueCraftItem';

export const useCreateQueueCraftItemMutation = () => {
  const id = useHeroId();
  const queryClient = useQueryClient();
  const { addQueueCraftItems } = useQueueCraftItem();
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
      queryClient.invalidateQueries({ queryKey: getQueueCraftItemOptions(id).queryKey });
      // if (data) {
      //   addQueueCraftItems(data.buildingType, data);
      // }
    },
  });
};

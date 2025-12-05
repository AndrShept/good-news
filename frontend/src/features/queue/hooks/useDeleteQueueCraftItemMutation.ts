import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { client } from '@/lib/utils';
import { BuildingType, ErrorResponse } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useQueueCraftItem } from './useQueueCraftItem';

export const useDeleteQueueCraftItemMutation = () => {
  const id = useHeroId();
  const { removeQueueCraftItems } = useQueueCraftItem();
  return useMutation({
    mutationFn: async (removeData: { queueCraftItemId: string; buildingType: BuildingType }) => {
      const res = await client.hero[':id'].action['queue-craft'][':queueCraftItemId'].$delete({
        param: {
          id,
          queueCraftItemId: removeData.queueCraftItemId,
        },
      });
      if (!res.ok) {
        const err = (await res.json()) as unknown as ErrorResponse;
        throw new Error(err.message, { cause: { canShow: err.canShow } });
      }
      return await res.json();
    },
    onSuccess: (_, { buildingType, queueCraftItemId }) => {
      removeQueueCraftItems(queueCraftItemId, buildingType);
    },
  });
};

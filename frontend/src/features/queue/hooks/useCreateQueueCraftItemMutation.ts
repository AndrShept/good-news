import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { client } from '@/lib/utils';
import { BuildingType, CraftBuildingType, ErrorResponse } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useQueueCraftItem } from './useQueueCraftItem';

export const useCreateQueueCraftItemMutation = () => {
  const id = useHeroId();
  const { addQueueCraftItems } = useQueueCraftItem();
  return useMutation({
    mutationFn: async ({
      craftItemId,
      coreMaterialType,
      buildingType,
    }: {
      craftItemId: string;
      coreMaterialType: string | undefined;
      buildingType: CraftBuildingType
    }) => {
      const res = await client.hero[':id'].action['queue-craft'].$post({
        param: {
          id,
        },
        json: {
          craftItemId,
          coreMaterialType,
          buildingType,
        },
      });
      if (!res.ok) {
        const err = (await res.json()) as unknown as ErrorResponse;
        throw new Error(err.message, { cause: { canShow: err.canShow } });
      }
      return await res.json();
    },
    // onSuccess: ({ data }) => {
    //   if (data) {
    //     addQueueCraftItems(data.buildingType, data);
    //   }
    // },
  });
};

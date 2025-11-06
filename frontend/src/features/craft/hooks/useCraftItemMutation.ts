import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { useUpdateHero } from '@/features/hero/hooks/useUpdateHero';
import { client } from '@/lib/utils';
import { ErrorResponse, ResourceType } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

export const useCraftItemMutation = () => {
  const id = useHeroId();
  const { addCraftItemsQueue } = useHeroUpdate();
  return useMutation({
    mutationFn: async ({ craftItemId, resourceType }: { craftItemId: string; resourceType: ResourceType }) => {
      const res = await client.hero[':id'].action.craft.$post({
        param: {
          id,
        },
        json: {
          craftItemId,
          resourceType,
        },
      });
      if (!res.ok) {
        const err = (await res.json()) as unknown as ErrorResponse;
        throw new Error(err.message, { cause: { canShow: err.canShow } });
      }
      return await res.json();
    },
    onSuccess: ({ data }) => {
      addCraftItemsQueue(data);
    },
  });
};

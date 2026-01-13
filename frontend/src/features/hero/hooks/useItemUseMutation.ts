import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { itemUse } from '../api/item-use';
import { useHeroId } from './useHeroId';

export const useItemUseMutation = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  return useMutation({
    mutationFn: ({ itemInstanceId }: { itemInstanceId: string }) => itemUse({ heroId, itemInstanceId }),

    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
      });
      setGameMessage({
        success: true,
        type: 'INFO',
        text: data.message,
        data: { gameItemName: data.data?.name ?? '' },
      });
    },
  });
};

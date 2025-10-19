import { toastError } from '@/lib/utils';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteInventoryItem } from '../api/delete-inventory-item';
import { getHeroOptions } from '../api/get-hero';
import { getInventoryOptions } from '../api/get-inventory';
import { useHero } from './useHero';

export const useDeleteInventoryItem = (itemId: string) => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const id = useHero((state) => state?.data?.id ?? '');
  return useMutation({
    mutationFn: () =>
      deleteInventoryItem({
        id,
        itemId,
      }),

    async onSuccess(data) {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: getHeroOptions().queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: getInventoryOptions(id).queryKey,
        });
        setGameMessage({
          success: true,
          type: 'success',
          text: data.message,
          data: { gameItemName: data.data?.gameItem?.name ?? '', quantity: data.data?.quantity },
        });
      } else {
        setGameMessage({
          success: false,
          type: 'error',
          text: data.message,
        });
      }
    },
  });
};

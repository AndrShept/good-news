import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteContainerSlotItem } from '../api/delete-container-slot-item';
import { getItemContainerOptions } from '../api/get-item-container';

interface IDeleteContainerSlotItem {
  id: string;
  containerSlotId: string;
}

export const useDeleteContainerSlotItem = (itemContainerId: string) => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const id = useHeroId();
  return useMutation({
    mutationFn: ({ containerSlotId, id }: IDeleteContainerSlotItem) => deleteContainerSlotItem({ id, containerSlotId }),

    async onSuccess(data) {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: getItemContainerOptions(id, itemContainerId).queryKey,
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

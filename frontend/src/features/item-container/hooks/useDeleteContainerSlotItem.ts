import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteContainerSlotItem } from '../api/delete-container-slot-item';
import { getItemContainerOptions } from '../api/get-item-container';
import { useItemContainerUpdate } from './useItemContainerUpdate';

interface IDeleteContainerSlotItem {
  containerSlotId: string;
}

export const useDeleteContainerSlotItem = (itemContainerId: string) => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const { removeContainerSlotItem } = useItemContainerUpdate();
  const heroId = useHeroId();
  return useMutation({
    mutationFn: ({ containerSlotId }: IDeleteContainerSlotItem) => deleteContainerSlotItem({ id: heroId, containerSlotId }),

    async onSuccess(data, variable) {
      if (data.success) {
        // await queryClient.invalidateQueries({
        //   queryKey: getItemContainerOptions(id, itemContainerId).queryKey,
        // });
        removeContainerSlotItem(itemContainerId, variable.containerSlotId);
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

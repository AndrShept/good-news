import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteContainerSlotItem } from '../api/delete-container-slot-item';
import { useItemContainerUpdate } from './useItemContainerUpdate';

interface IDeleteContainerSlotItem {
  containerSlotId: string;
}

export const useDeleteContainerSlotItem = (itemContainerId: string) => {
  const setGameMessage = useSetGameMessage();
  const { removeContainerSlotItem } = useItemContainerUpdate();
  const heroId = useHeroId();
  return useMutation({
    mutationFn: ({ containerSlotId }: IDeleteContainerSlotItem) => deleteContainerSlotItem({ id: heroId, containerSlotId }),

    async onSuccess(data, variable) {
      if (data.success) {
        removeContainerSlotItem(itemContainerId, variable.containerSlotId);
        setGameMessage({
          success: true,
          type: 'SUCCESS',
          text: data.message,
          data: { gameItemName: data.data?.gameItem?.name ?? '', quantity: data.data?.quantity },
        });
      } else {
        setGameMessage({
          success: false,
          type: 'ERROR',
          text: data.message,
        });
      }
    },
  });
};

import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { toastError } from '@/lib/utils';
import { ItemContainerType } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteContainerSlotItem } from '../api/delete-conteiner-slot-item';
import { getItemContainerByTypeOptions } from '../api/get-item-container-by-type';

interface IDeleteContainerSlotItem {
  id: string;
  itemContainerId: string;
  containerSlotId: string;
  type: ItemContainerType;
}

export const useDeleteContainerSlotItem = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const id = useHeroId();
  return useMutation({
    mutationFn: ({ containerSlotId, itemContainerId, id }: IDeleteContainerSlotItem) =>
      deleteContainerSlotItem({ id, itemContainerId, containerSlotId }),

    async onSuccess(data, variable) {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: getItemContainerByTypeOptions(id, variable.type).queryKey,
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

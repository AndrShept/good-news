import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation } from '@tanstack/react-query';

import { deleteContainerInstanceItem } from '../api/delete-container-instance-item';
import { useItemContainerUpdate } from '../../item-container/hooks/useItemContainerUpdate';

interface IDeleteContainerSlotItem {
  itemContainerId: string;
  itemInstanceId: string;
}

export const useDeleteContainerItem = () => {
  const setGameMessage = useSetGameMessage();
  const heroId = useHeroId();
  const { removeItemInstance } = useItemContainerUpdate();
  return useMutation({
    mutationFn: ({ itemContainerId, itemInstanceId }: IDeleteContainerSlotItem) =>
      deleteContainerInstanceItem({ id: heroId, itemContainerId, itemInstanceId }),

    async onSuccess(data, { itemContainerId, itemInstanceId }) {
      removeItemInstance(itemContainerId, itemInstanceId);
      setGameMessage({
        success: true,
        type: 'SUCCESS',
        text: data.message,
        data: [{ name: data.data?.name ?? '', quantity: data.data?.quantity }],
      });
    },
  });
};

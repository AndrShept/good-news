import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getItemContainerOptions } from '../../item-container/api/get-item-container';
import { useGetBackpackId } from '../../item-container/hooks/useGetBackpackId';
import { deleteContainerInstanceItem } from '../api/delete-container-instance-item';

interface IDeleteContainerSlotItem {
  itemContainerId: string;
  itemInstanceId: string;
}

export const useDeleteContainerItem = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  return useMutation({
    mutationFn: ({ itemContainerId, itemInstanceId }: IDeleteContainerSlotItem) =>
      deleteContainerInstanceItem({ id: heroId, itemContainerId, itemInstanceId }),

    async onSuccess(data, variable) {
      queryClient.invalidateQueries({
        queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
      });
      setGameMessage({
        success: true,
        type: 'SUCCESS',
        text: data.message,
        data: [{ name: data.data?.name ?? '', quantity: data.data?.quantity }],
      });
    },
  });
};

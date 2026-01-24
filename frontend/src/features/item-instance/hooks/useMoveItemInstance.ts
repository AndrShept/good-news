import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getItemContainerOptions } from '../../item-container/api/get-item-container';
import { moveItemInstance } from '../api/move-item-instance';

interface IUseMoveItemInstance {
  itemInstanceId: string;
  from: string;
  to: string;
}

export const useMoveItemInstance = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  return useMutation({
    mutationFn: ({ itemInstanceId, from, to }: IUseMoveItemInstance) => moveItemInstance({ id: heroId, itemInstanceId, from, to }),

    async onSuccess(data, { from, to }) {
      queryClient.invalidateQueries({
        queryKey: getItemContainerOptions(heroId, from).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getItemContainerOptions(heroId, to).queryKey,
      });
      // setGameMessage({
      //   success: true,
      //   type: 'SUCCESS',
      //   text: data.message,
      //   data: [{ name: data.data?.name ?? '', quantity: data.data?.quantity }],
      // });
    },
  });
};

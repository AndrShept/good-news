import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { useMutation } from '@tanstack/react-query';

import { moveItemInstance } from '../api/move-item-instance';

interface IUseMoveItemInstance {
  itemInstanceId: string;
  from: string;
  to: string;
}

export const useMoveItemInstance = () => {
  const heroId = useHeroId();
  const { updateItemContainer, removeItemInstance } = useItemContainerUpdate();
  return useMutation({
    mutationFn: ({ itemInstanceId, from, to }: IUseMoveItemInstance) => moveItemInstance({ id: heroId, itemInstanceId, from, to }),

    async onSuccess({ data }, { from, to, itemInstanceId }) {
      removeItemInstance(from, itemInstanceId);
      updateItemContainer(to, data?.toContainer);
    },
  });
};

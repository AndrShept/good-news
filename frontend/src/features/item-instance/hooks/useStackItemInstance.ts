import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { useMutation } from '@tanstack/react-query';

import { stackItemInstance } from '../api/stack-item-instance';

export const useStackItemInstance = () => {
  const heroId = useHeroId();
  const { updateItemByDeltaEvents } = useItemContainerUpdate();
  return useMutation({
    mutationFn: ({ fromItemInstanceId, toItemInstanceId, itemContainerId }: Omit<Parameters<typeof stackItemInstance>[0], 'id'>) =>
      stackItemInstance({ id: heroId, fromItemInstanceId, toItemInstanceId, itemContainerId }),

    async onSuccess({ data }) {
      if (data?.itemsDelta) {
        updateItemByDeltaEvents(data?.itemsDelta);
      }
    },
  });
};

import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { useMutation } from '@tanstack/react-query';

import { splitItemInstance } from '../api/split-item-instance';

export const useSplitItemInstance = () => {
  const heroId = useHeroId();
  const { updateItemByDeltaEvents } = useItemContainerUpdate();
  return useMutation({
    mutationFn: ({ itemInstanceId, itemContainerId, quantity }: Omit<Parameters<typeof splitItemInstance>[0], 'id'>) =>
      splitItemInstance({ id: heroId, itemInstanceId, itemContainerId, quantity }),

    async onSuccess({ data }) {
      if (data?.itemsDelta) {
        updateItemByDeltaEvents(data?.itemsDelta);
      }
    },
  });
};

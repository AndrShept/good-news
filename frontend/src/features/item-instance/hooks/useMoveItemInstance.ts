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
  const { removeItemInstance, addItemInstance, updateItemInstance } = useItemContainerUpdate();
  return useMutation({
    mutationFn: ({ itemInstanceId, from, to }: IUseMoveItemInstance) => moveItemInstance({ id: heroId, itemInstanceId, from, to }),

    async onSuccess({ data }, { from, to, itemInstanceId }) {
      console.log(data);
      removeItemInstance(from, itemInstanceId);
      if (data?.inventoryDeltas) {
        for (const i of data.inventoryDeltas) {
          switch (i.type) {
            case 'CREATE':
              addItemInstance(i.itemContainerId ?? '', i.item);
              break;
            case 'UPDATE':
              updateItemInstance(i.itemContainerId ?? '', i.itemInstanceId, i.updateData);
              break;
          }
        }
      }
    },
  });
};

import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { ItemInstance, TItemContainer } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useItemContainerUpdate = () => {
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const updateItemContainer = useCallback(
    (itemContainerId: string, data: Partial<TItemContainer> | undefined) => {
      queryClient.setQueriesData<TItemContainer>({ queryKey: getItemContainerOptions(heroId, itemContainerId).queryKey }, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          ...data,
        };
      });
    },
    [heroId],
  );
  const removeItemInstance = useCallback(
    (itemContainerId: string, itemInstanceId: string) => {
      queryClient.setQueriesData<TItemContainer>({ queryKey: getItemContainerOptions(heroId, itemContainerId).queryKey }, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          itemsInstance: oldData.itemsInstance.filter((i) => i.id !== itemInstanceId),
        };
      });
    },
    [heroId],
  );
  const addItemInstance = useCallback(
    (itemContainerId: string, newItem: ItemInstance) => {
      queryClient.setQueriesData<TItemContainer>({ queryKey: getItemContainerOptions(heroId, itemContainerId).queryKey }, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          itemsInstance: [...oldData.itemsInstance, newItem],
        };
      });
    },
    [heroId],
  );
  const updateItemInstance = useCallback(
    (itemContainerId: string, itemInstanceId: string, updateData: Partial<ItemInstance>) => {
      queryClient.setQueriesData<TItemContainer>({ queryKey: getItemContainerOptions(heroId, itemContainerId).queryKey }, (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          itemsInstance: oldData.itemsInstance.map((i) => (i.id === itemInstanceId ? { ...i, ...updateData } : i)),
        };
      });
    },
    [heroId],
  );

  return { updateItemContainer, removeItemInstance, addItemInstance, updateItemInstance };
};

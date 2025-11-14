import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { ContainerSlot, TItemContainer } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

import { getItemContainerOptions } from '../api/get-item-container';

export const useItemContainerUpdate = () => {
  const heroId = useHeroId();
  const queryClient = useQueryClient();
  const itemContainerUpdate = (containerId: string, data: Partial<TItemContainer>) => {
    queryClient.setQueryData<TItemContainer>(getItemContainerOptions(heroId, containerId).queryKey, (oldData) => {
      if (!oldData) return;
      return { ...oldData, ...data };
    });
  };
  const removeContainerSlotItem = (containerId: string, containerSlotItemId: string) => {
    queryClient.setQueryData<TItemContainer>(getItemContainerOptions(heroId, containerId).queryKey, (oldData) => {
      if (!oldData) return;

      return { ...oldData, containerSlots: oldData.containerSlots?.filter((item) => item.id !== containerSlotItemId) };
    });
  };
  const addContainerSlotItem = (containerId: string, containerSlotItem: ContainerSlot) => {
    queryClient.setQueryData<TItemContainer>(getItemContainerOptions(heroId, containerId).queryKey, (oldData) => {
      if (!oldData) return;
      return { ...oldData, containerSlots: [...(oldData.containerSlots ?? []), containerSlotItem] };
    });
  };
  const updateContainerSlotItem = (containerId: string, containerSlotItemId: string, updateData: Partial<ContainerSlot>) => {
    queryClient.setQueryData<TItemContainer>(getItemContainerOptions(heroId, containerId).queryKey, (oldData) => {
      if (!oldData) return;
      return {
        ...oldData,
        containerSlots: oldData.containerSlots?.map((item) => (item.id === containerSlotItemId ? { ...item, ...updateData } : item)),
      };
    });
  };
  return {
    itemContainerUpdate,
    removeContainerSlotItem,
    addContainerSlotItem,
    updateContainerSlotItem,
  };
};

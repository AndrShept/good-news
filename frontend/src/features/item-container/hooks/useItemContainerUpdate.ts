import { useHeroId } from '@/features/hero/hooks/useHeroId';
import {  TItemContainer } from '@/shared/types';
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



  return {
    itemContainerUpdate,

  };
};

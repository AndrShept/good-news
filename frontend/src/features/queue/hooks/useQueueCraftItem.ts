import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { BuildingType, QueueCraftItem } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getQueueCraftItemOptions } from '../api/getQueueCraftItems';

export const useQueueCraftItem = () => {
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const addQueueCraftItems = useCallback((buildingType: BuildingType, data: QueueCraftItem) => {
    queryClient.setQueriesData<QueueCraftItem[]>({ queryKey: getQueueCraftItemOptions(heroId, buildingType).queryKey }, (oldData) => {
      if (!oldData) return;
      console.log(oldData);
      return [...oldData, data];
    });
  }, []);
  const removeQueueCraftItems = useCallback((queueCraftItemId: string, buildingType: BuildingType) => {
    queryClient.setQueriesData<QueueCraftItem[]>({ queryKey: getQueueCraftItemOptions(heroId, buildingType).queryKey }, (oldData) => {
      if (!oldData) return;
      return oldData.filter((item) => item.id !== queueCraftItemId);
    });
  }, []);
  const updateQueueCraftItems = useCallback((queueCraftItemId: string, buildingType: BuildingType, data: Partial<QueueCraftItem>) => {
    queryClient.setQueriesData<QueueCraftItem[]>({ queryKey: getQueueCraftItemOptions(heroId, buildingType).queryKey }, (oldData) => {
      if (!oldData) return;

      return oldData.map((item) => {
        if (item.id === queueCraftItemId) {
          return { ...item, ...data };
        }
        return item;
      });
    });
  }, []);

  return { addQueueCraftItems, removeQueueCraftItems, updateQueueCraftItems };
};

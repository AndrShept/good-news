import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getQueueCraftItemOptions } from '../api/getQueueCraftItems';
import { QueueCraft } from '@/shared/types';

export const useQueueCraftItem = () => {
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const addQueueCraftItems = useCallback(( data: QueueCraft) => {
    queryClient.setQueriesData<QueueCraft[]>({ queryKey: getQueueCraftItemOptions(heroId).queryKey }, (oldData) => {
      if (!oldData) return;
      console.log(oldData);
      return [...oldData, data];
    });
  }, []);
  const removeQueueCraftItems = useCallback((queueCraftItemId: string) => {
    queryClient.setQueriesData<QueueCraft[]>({ queryKey: getQueueCraftItemOptions(heroId).queryKey }, (oldData) => {
      if (!oldData) return;
      return oldData.filter((item) => item.id !== queueCraftItemId);
    });
  }, []);
  const updateQueueCraftItems = useCallback((queueCraftItemId: string,  data: Partial<QueueCraft>) => {
    queryClient.setQueriesData<QueueCraft[]>({ queryKey: getQueueCraftItemOptions(heroId).queryKey }, (oldData) => {
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

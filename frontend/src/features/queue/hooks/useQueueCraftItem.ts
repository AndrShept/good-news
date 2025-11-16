import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { QueueCraftItem } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getQueueCraftItemOptions } from '../api/getQueueCraftItems';

export const useQueueCraftItem = () => {
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const addQueueCraftItems = useCallback((data: QueueCraftItem) => {
    queryClient.setQueriesData<QueueCraftItem[]>(
      { queryKey: getQueueCraftItemOptions(heroId).queryKey },
      (oldData) => {
        if (!oldData) return;
        return [...oldData, data];
      }
    );
  }, []);
  const removeQueueCraftItems = useCallback((queueCraftItemId: string) => {
    queryClient.setQueriesData<QueueCraftItem[]>(
      { queryKey: getQueueCraftItemOptions(heroId).queryKey },
      (oldData) => {
        if (!oldData) return;
        return oldData.filter((item) => item.id !== queueCraftItemId);
      }
    );
  }, []);
  const updateQueueCraftItems = useCallback((queueCraftItemId: string, data: Partial<QueueCraftItem>) => {
    queryClient.setQueriesData<QueueCraftItem[]>(
      { queryKey: getQueueCraftItemOptions(heroId).queryKey },
      (oldData) => {
        if (!oldData) return;

        return oldData.map((item) => {
          if (item.id === queueCraftItemId) {
            return { ...item, ...data };
          }
          return item;
        });
      }
    );
  }, []);

  return { addQueueCraftItems, removeQueueCraftItems, updateQueueCraftItems };
}
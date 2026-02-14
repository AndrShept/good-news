import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { QueueCraft } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getQueueCraftItemOptions } from '../api/getQueueCraftItems';

export const useQueueCraftItem = () => {
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const addQueueCraftItems = useCallback(
    (data: QueueCraft) => {
      queryClient.setQueriesData<QueueCraft[]>({ queryKey: getQueueCraftItemOptions(heroId).queryKey }, (oldData) => {
        if (!oldData) return;
        console.log(oldData);
        return [...oldData, data];
      });
    },
    [heroId],
  );
  const removeQueueCraftItems = useCallback(
    (queueCraftItemId: string) => {
      queryClient.setQueriesData<QueueCraft[]>({ queryKey: getQueueCraftItemOptions(heroId).queryKey }, (oldData) => {
        if (!oldData) return;
        return oldData.filter((item) => item.id !== queueCraftItemId);
      });
    },
    [heroId],
  );
  const updateQueueCraftItems = useCallback(
    (queueCraftItemId: string, data: Partial<QueueCraft>) => {
      queryClient.setQueriesData<QueueCraft[]>({ queryKey: getQueueCraftItemOptions(heroId).queryKey }, (oldData) => {
        if (!oldData) return;

        return oldData.map((item) => {
          if (item.id === queueCraftItemId) {
            return { ...item, ...data };
          }
          return item;
        });
      });
    },
    [heroId],
  );
  const setQueueCraftItems = useCallback(
    (data: QueueCraft[] | undefined) => {
      queryClient.setQueriesData<QueueCraft[]>({ queryKey: getQueueCraftItemOptions(heroId).queryKey }, () => {
        if (!data) return;

        return data;
      });
    },
    [heroId],
  );

  return { addQueueCraftItems, removeQueueCraftItems, updateQueueCraftItems, setQueueCraftItems };
};

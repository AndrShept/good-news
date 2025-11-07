import { ApiHeroResponse, Hero, QueueCraftItem } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getHeroOptions } from '../api/get-hero';

export type OmitDeepHero = Omit<Partial<Hero>, 'location' | 'state' | 'action' | 'group'> & {
  location?: Partial<Hero['location']>;
  action?: Partial<Hero['action']>;
  group?: Partial<Hero['group']>;
  state?: Partial<Hero['state']>;
};

export const useHeroUpdate = () => {
  const queryClient = useQueryClient();

  const updateHero = useCallback((data: OmitDeepHero) => {
    queryClient.setQueriesData<ApiHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
      if (!oldData?.data) return;
      return {
        ...oldData,
        data: {
          ...oldData.data,
          ...data,
          action: { ...oldData.data.action, ...data.action },
          state: { ...oldData.data.state, ...data.state },
          location: {
            ...oldData.data.location,
            ...data.location,
          },
          group: { ...oldData.data.group, ...data.group },
        },
      } as ApiHeroResponse;
    });
  }, []);
  const addCraftItemsQueue = useCallback((data: QueueCraftItem | undefined) => {
    queryClient.setQueriesData<ApiHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
      if (!oldData?.data) return;
      return {
        ...oldData,
        data: { ...oldData.data, queueCraftItems: [...(oldData.data?.queueCraftItems ?? []), data] },
      } as ApiHeroResponse;
    });
  }, []);
  const deleteCraftItemsQueue = useCallback((queueCraftItemId: string) => {
    queryClient.setQueriesData<ApiHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
      if (!oldData?.data) return;
      return {
        ...oldData,
        data: { ...oldData.data, queueCraftItems: oldData.data?.queueCraftItems?.filter((item) => item.id !== queueCraftItemId) },
      } as ApiHeroResponse;
    });
  }, []);

  return { updateHero, addCraftItemsQueue, deleteCraftItemsQueue };
};

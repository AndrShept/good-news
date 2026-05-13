import { ApiGetHeroResponse, BuffInstance, OmitDeepHero } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getHeroOptions } from '../api/get-hero';

export const useHeroUpdate = () => {
  const queryClient = useQueryClient();

  const updateHero = useCallback((data: OmitDeepHero) => {
    queryClient.setQueriesData<ApiGetHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
      if (!oldData) return;
      return {
        ...oldData,

        ...data,

        location: {
          ...oldData.location,
          ...data.location,
        },
        group: { ...oldData.group, ...data.group },
        regen: { ...oldData.regen, ...data.regen },
      };
    });
  }, []);

  const addBuff = (newBuff: BuffInstance) => {
    queryClient.setQueryData<ApiGetHeroResponse>(getHeroOptions().queryKey, (oldData) => {
      if (!oldData) return;
      const filtered = oldData.buffs.filter((buff) => buff.id !== newBuff.id);

      return {
        ...oldData,
        buffs: [...filtered, newBuff],
      };
    });
  };
  const removeBuff = (buffId: string) => {
    queryClient.setQueryData<ApiGetHeroResponse>(getHeroOptions().queryKey, (oldData) => {
      if (!oldData) return;
      return {
        ...oldData,
        buffs: oldData.buffs.filter((b) => b.id !== buffId),
      };
    });
  };
  const updateBuff = (buffId: string, updateData: Partial<BuffInstance>) => {
    queryClient.setQueryData<ApiGetHeroResponse>(getHeroOptions().queryKey, (oldData) => {
      if (!oldData) return;
      return {
        ...oldData,
        buffs: oldData.buffs.map((b) => (b.id === buffId ? { ...b, ...updateData } : b)),
      };
    });
  };

  return { updateHero, addBuff, removeBuff, updateBuff };
};

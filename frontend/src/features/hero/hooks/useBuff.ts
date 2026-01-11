import { useQueryClient } from '@tanstack/react-query';

import { getBuffOptions } from '../api/get-buff';
import { useHeroId } from './useHeroId';
import { BuffInstance } from '@/shared/types';

export const useBuff = () => {
  const heroId = useHeroId();
  const queryClient = useQueryClient();
  const removeBuff = (id: string) => {
    queryClient.setQueriesData<BuffInstance[]>({ queryKey: getBuffOptions(heroId).queryKey }, (oldData) => {
      if (!oldData) return;

      return oldData.filter((buff) => buff.id !== id);
    });
  };

  return {
    removeBuff,
  };
};

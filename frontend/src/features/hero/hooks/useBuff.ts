import { Buff } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

import { getBuffOptions } from '../api/get-buff';
import { useHeroId } from './useHeroId';

export const useBuff = () => {
  const id = useHeroId();
  const queryClient = useQueryClient();
  const removeBuff = (gameItemId: string) => {
    queryClient.setQueriesData<Buff[]>({ queryKey: getBuffOptions(id).queryKey }, (oldData) => {
      if (!oldData) return;

      return oldData.filter((buff) => buff.gameItemId !== gameItemId);
    });
  };

  return {
    removeBuff,
  };
};

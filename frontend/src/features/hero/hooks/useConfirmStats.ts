import { toastError } from '@/lib/utils';
import { changeStatSchema } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { confirmStats } from '../api/confirm-stats';
import { getHeroOptions } from '../api/get-hero';
import { useHeroId } from './useHeroId';

export const useConfirmStats = (data: z.infer<typeof changeStatSchema>) => {
  const queryClient = useQueryClient();
  const setGameMessage = useSetGameMessage();
  const heroId = useHeroId();
  return useMutation({
    mutationFn: () => confirmStats(heroId, data),
    onError: () => {
      toastError();
    },
    onSuccess: async (data) => {
      if (data.success) {
        setGameMessage({ type: 'SUCCESS', text: data.message });
      }

      queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
    },
  });
};

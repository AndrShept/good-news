import { toastError } from '@/lib/utils';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { confirmStats, extendedStatsSchema } from '../api/confirm-stats';
import { getHeroOptions } from '../api/get-hero';

export const useConfirmStats = (id: string, data: z.infer<typeof extendedStatsSchema>) => {
  const queryClient = useQueryClient();
  const setGameMessage = useSetGameMessage();

  return useMutation({
    mutationFn: () => confirmStats(id, data),
    onError: () => {
      toastError();
    },
    onSuccess: async (data) => {
      if (data.success) {
        setGameMessage({ type: 'success', text: data.message });
      }

      await queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });

    },
  });
};

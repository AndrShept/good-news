import { toastError } from '@/lib/utils';
import { useGameMessages } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { resetStats } from '../api/reset-stats';

export const useResetStats = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetStats,
    async onSuccess(data, variables, context) {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: getHeroOptions().queryKey,
        });
        setGameMessage({
          success: data.success,
          type: 'SUCCESS',
          text: data.message,
        });
      }
      if (!data.success) {
        setGameMessage({
          success: data.success,
          type: 'ERROR',
          text: data.message,
        });
      }
    },
    onError: () => {
      toastError();
    },
  });
};

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
    async onSuccess(data) {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: getHeroOptions().queryKey,
        });
        setGameMessage({
          color: 'GREEN',
          text: data.message,
        });
      }
      if (!data.success) {
        setGameMessage({
          color: 'RED',
          text: data.message,
        });
      }
    },
    onError: () => {
      toastError();
    },
  });
};

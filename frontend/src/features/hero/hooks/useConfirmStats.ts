import { client, toastError } from '@/lib/utils';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferResponseType } from 'hono/client';
import { z } from 'zod';

import { confirmStats, extendedStatsSchema } from '../api/confirm-stats';
import { getHeroOptions } from '../api/get-hero';

type ApiResponseHero = InferResponseType<typeof client.hero.$get>;
export const useConfirmStats = (data: z.infer<typeof extendedStatsSchema>) => {
  const queryClient = useQueryClient();
  const setGameMessage = useSetGameMessage();
  const res = queryClient.getQueryData<ApiResponseHero>(['hero']);
  console.log(res);
  return useMutation({
    mutationFn: () => confirmStats(res?.data?.id ?? '', data),
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

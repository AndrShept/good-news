import { client } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useHeroId } from './useHeroId';

export const useLeaveWorldObject = () => {
  const id = useHeroId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tileId, worldObjectId }: { tileId: string; worldObjectId: string }) =>
      client.hero[':id']['world-object'].leave.$post({
        param: {
          id,
        },
        json: {
          tileId,
          worldObjectId,
        },
      }),
  });
};

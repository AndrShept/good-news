import { client } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

type TUseEnterTown = {
  id: string;
  tileId: string;
};

export const useEnterTown = () => {
  return useMutation({
    mutationFn: async ({ id, tileId }: TUseEnterTown) => {
      const data = await client.hero[':id'].action['enter-town'].$post({
        param: {
          id,
        },
        json: {
          tileId,
        },
      });
      return data.json();
    },
  });
};

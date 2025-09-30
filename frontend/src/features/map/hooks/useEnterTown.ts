import { client } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

export const useEnterTown = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const data = await client.hero[':id'].action['enter-town'].$post({
        param: {
          id,
        },
      });
      return data.json();
    },
  });
};

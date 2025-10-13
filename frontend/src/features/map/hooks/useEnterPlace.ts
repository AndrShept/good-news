import { client } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

export const useEnterPlace = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const data = await client.hero[':id'].action['enter-place'].$post({
        param: {
          id,
        },
      });
      return data.json();
    },
  });
};

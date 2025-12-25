import { client } from '@/lib/utils';
import { StateType } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useHeroStateMutation = () => {
  const id = useHeroId();
  const { updateHero } = useHeroUpdate();
  return useMutation({
    mutationFn: async (type: StateType) => {
      const res = await client.hero[':id'].state.$put({
        param: {
          id,
        },
        json: {
          type,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    },

    onSuccess: (_, type) => {
      updateHero({
        state: type,
      });
    },
  });
};

import { client } from '@/lib/utils';
import { StateType } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useHeroChange } from './useHeroChange';
import { useHeroId } from './useHeroId';

export const useStateChange = () => {
  const { heroChange } = useHeroChange();
  const id = useHeroId();

  return useMutation({
    mutationFn: (type: StateType) =>
      client.hero[':id'].state.change.$put({
        param: {
          id,
        },
        json: {
          type,
        },
      }),
    onSuccess: (_, type) => {
      heroChange({
        state: {
          type,
        },
      });
    },
  });
};

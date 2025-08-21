import { client } from '@/lib/utils';
import { StateType } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useHeroChange } from './useHeroChange';
import { useHeroId } from './useHeroId';

export const useHeroSetState = () => {
  const id = useHeroId();
  const { heroChange } = useHeroChange();
  return useMutation({
    mutationFn: (type: StateType) =>
      client.hero[':id'].state.$put({
        param: {
          id,
        },
        json: {
          type,
        },
      }),
    onSuccess: (_ , type) => {
      heroChange({
        state: {
          type,
        },
      });
    },
  });
};

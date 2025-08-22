import { client } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useHeroChange } from './useHeroChange';
import { useHeroId } from './useHeroId';

export const useBackTownEntry = () => {
  const id = useHeroId();
  const { heroChange } = useHeroChange();
  return useMutation({
    mutationFn: () =>
      client.hero[':id'].action['back-town-entry'].$post({
        param: {
          id,
        },
      }),
    onSuccess: async () => {
      heroChange({
        location: {
          currentBuilding: null,
        },
      });
    },
  });
};

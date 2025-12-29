import { client } from '@/lib/utils';
import { IPosition } from '@/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useWalkMapMutation = () => {
  const id = useHeroId();
  const queryClient = useQueryClient();
  const { updateHero } = useHeroUpdate();
  return useMutation({
    mutationFn: async (targetPos: IPosition) => {
      const res = await client.hero[':id'].action['walk-map'].$post({
        param: { id },
        json: targetPos,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    },
    onSuccess: async (_, { x, y }) => {
      updateHero({ location: { targetX: x, targetY: y } });
    },
  });
};

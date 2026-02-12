import { client } from '@/lib/utils';
import { IPosition } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useWalkMapMutation = (setFinishTime: (num: number) => void) => {
  const id = useHeroId();
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
    onSuccess: async (res, { x, y }) => {
      updateHero({ location: { targetX: x, targetY: y } });
      setFinishTime(res.data?.finishWalkTime ?? 0);
    },
  });
};

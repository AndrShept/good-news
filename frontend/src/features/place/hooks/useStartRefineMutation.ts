import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { client } from '@/lib/utils';
import { ErrorResponse, RefiningBuildingKey } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation } from '@tanstack/react-query';

export const useStartRefineMutation = () => {
  const id = useHeroId();
  const { updateHero } = useHeroUpdate();
  const setGameMessage = useSetGameMessage();
  return useMutation({
    mutationFn: async ({ refineBuildingKey, containerId }: { refineBuildingKey: RefiningBuildingKey; containerId: string }) => {
      const res = await client.hero[':id'].action.refine[':refineBuildingKey'].$post({
        param: {
          id,
          refineBuildingKey,
        },
        json: { containerId },
      });
      if (!res.ok) {
        const err = (await res.json()) as unknown as ErrorResponse;
        throw new Error(err.message, { cause: { canShow: err.canShow } });
      }
      return await res.json();
    },
    onSuccess: ({ message, data }) => {
      updateHero({ refiningFinishAt: data?.refiningFinishAt, state: data?.state });
      setGameMessage({
        color: 'GREEN',
        text: message,
      });
    },
  });
};

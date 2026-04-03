import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { client } from '@/lib/utils';
import { ErrorResponse, RefiningBuildingKey } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

export const useStartRefineMutation = () => {
  const id = useHeroId();

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
    onSuccess: ({ data }) => {},
  });
};

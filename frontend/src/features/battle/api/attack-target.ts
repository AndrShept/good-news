import { client } from '@/lib/utils';
import { ErrorResponse, MapChunkEntitiesType } from '@/shared/types';

export const attackTarget = async ({
  targetId,
  targetType,
  heroId,
}: {
  heroId: string;
  targetId: string;
  targetType: Extract<MapChunkEntitiesType, 'HERO' | 'CREATURE'>;
}) => {
  const res = await client.hero[':id'].attack[':targetId'].$post({
    param: {
      id: heroId,
      targetId,
    },
    json: {
      targetType,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return res.json();
};

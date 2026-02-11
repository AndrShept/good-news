import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export interface HeroTravel {
  heroId: string;
  type: 'PLACE' | 'ENTRANCE';
  entranceId?: string;
  placeId?: string;
}

export const heroTravel = async ({ heroId, type, entranceId, placeId }: HeroTravel) => {
  const res = await client.hero[':id'].action.travel.$post({
    param: { id: heroId },
    json: {
      type,
      entranceId,
      placeId,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};

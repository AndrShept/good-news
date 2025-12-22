import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const createItemContainer = async (heroId: string) => {
  const res = await client.hero[':id']['item-container'].create.$post({
    param: {
      id: heroId,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};

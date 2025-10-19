import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const shopBuyItems = async ({ id, gameItemId }: { id: string; gameItemId: string }) => {
  const res = await client.hero[':id'].shop.items[':gameItemId'].buy.$post({
    param: {
      id,
      gameItemId,
    },
  });

  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }
  return await res.json();
};

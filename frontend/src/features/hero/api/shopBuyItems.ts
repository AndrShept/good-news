import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const shopBuyItems = async ({ id, itemId }: { id: string; itemId: string }) => {
  const res = await client.hero[':id'].shop.items[':itemId'].buy.$post({
    param: {
      id,
      itemId,
    },
  });

  if (!res.ok) {
    return (await res.json()) as ErrorResponse;
  }
  return await res.json();
};

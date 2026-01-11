import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const shopBuyItems = async ({ id, items }: { id: string; items: { id: string; quantity: number }[] }) => {
  const res = await client.hero[':id'].shop.buy.$post({
    param: { id },
    json: { items },
  });

  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }
  return await res.json();
};

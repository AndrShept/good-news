import { client } from '@/lib/utils';
import { ErrorResponse, ShopCartItem } from '@/shared/types';

interface AcceptShopItems {
  id: string;
  npcId: string;
  action: 'buy' | 'sell';
  items: ShopCartItem[];
}

export const acceptShopItems = async ({ id, npcId, action, items }: AcceptShopItems) => {
  const res = await client.hero[':id'].npc[':npcId'].shop[':action'].$post({
    param: { id, npcId, action },
    json: { items },
  });

  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }
  return await res.json();
};

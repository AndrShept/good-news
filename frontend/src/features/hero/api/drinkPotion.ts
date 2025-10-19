import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const drinkPotion = async ({ id, inventoryItemId }: { id: string; inventoryItemId: string }) => {
  const res = await client.hero[':id'].inventory[':inventoryItemId'].drink.$post({
    param: {
      id,
      inventoryItemId,
    },
  });
  if (!res.ok) {
    return (await res.json()) as ErrorResponse;
  }

  return await res.json();
};

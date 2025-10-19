import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const equipItem = async ({ id, inventoryItemId }: { id: string; inventoryItemId: string }) => {
  const res = await client.hero[':id'].inventory[':inventoryItemId'].equip.$post({
    param: {
      id,
      inventoryItemId,
    },
  });
  if (!res.ok) {
    const err = await res.json() as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};

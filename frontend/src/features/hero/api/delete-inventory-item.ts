import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const deleteInventoryItem = async ({ id, itemId }: { id: string; itemId: string }) => {
  const res = await client.hero[':id'].inventory[':itemId'].delete.$delete({
    param: {
      id,
      itemId,
    },
  });
  if (!res.ok) {
    return (await res.json()) as unknown as ErrorResponse;
  }

  return await res.json();
};

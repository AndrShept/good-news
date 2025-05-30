import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const unEquipItem = async ({ id, itemId }: { id: string; itemId: string }) => {
  const res = await client.hero[':id'].equipment[':itemId'].unequip.$post({
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

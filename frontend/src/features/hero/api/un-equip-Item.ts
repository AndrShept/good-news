import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const unEquipItem = async ({ id, equipmentItemId }: { id: string; equipmentItemId: string }) => {
  const res = await client.hero[':id'].equipment[':equipmentItemId'].unequip.$post({
    param: {
      id,
      equipmentItemId,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};

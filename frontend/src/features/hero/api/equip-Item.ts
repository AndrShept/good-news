import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const equipItem = async ({ id, itemId }: { id: string; itemId: string }) => {
  const res = await client.hero[':id'].inventory[':itemId'].equip.$post({
    param: {
      id,
      itemId,
    },
  }); 
  // if (!res.ok) {
  //   return (await res.json()) as ErrorResponse;
  // }

  return await res.json();
};

import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const changeNameItemContainer = async (heroId: string, itemContainerId: string, name: string) => {
  const res = await client.hero[':id']['item-container'][':itemContainerId'].$put({
    param: { id: heroId, itemContainerId },
    json: { name },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};

import { client } from '@/lib/utils';
import { ErrorResponse, TItemContainer } from '@/shared/types';

export const changeNameItemContainer = async (heroId: string, itemContainerId: string, data: { name?: string; color?: string }) => {
  const res = await client.hero[':id']['item-container'][':itemContainerId'].$put({
    param: { id: heroId, itemContainerId },
    json: { ...data },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};

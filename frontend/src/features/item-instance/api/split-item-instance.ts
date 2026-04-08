import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const splitItemInstance = async ({
  id,
  itemInstanceId,
  itemContainerId,
  quantity,
}: {
  id: string;
  itemInstanceId: string;
  itemContainerId: string;
  quantity: number;
}) => {
  const res = await client.hero[':id']['item'][':itemInstanceId']['split']['$post']({
    param: { id, itemInstanceId },
    json: {
      itemContainerId,
      quantity,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};

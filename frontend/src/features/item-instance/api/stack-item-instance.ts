import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const stackItemInstance = async ({
  id,
  fromItemInstanceId,
  toItemInstanceId,
  itemContainerId,
}: {
  id: string;
  fromItemInstanceId: string;
  toItemInstanceId: string;
  itemContainerId: string;
}) => {
  const res = await client.hero[':id']['item']['stack']['$post']({
    param: {
      id,
    },
    json: {
      fromItemInstanceId,
      toItemInstanceId,
      itemContainerId,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};

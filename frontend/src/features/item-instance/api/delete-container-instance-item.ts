import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const deleteContainerInstanceItem = async ({
  id,
  itemContainerId,
  itemInstanceId,
}: {
  id: string;
  itemContainerId: string;
  itemInstanceId: string;
}) => {
  const res = await client.hero[':id']['item-container'][':itemContainerId']['item'][':itemInstanceId']['$delete']({
    param: { id, itemContainerId, itemInstanceId },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message);
  }

  return await res.json();
};

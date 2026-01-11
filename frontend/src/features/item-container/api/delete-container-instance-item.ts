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
    return (await res.json()) as unknown as ErrorResponse;
  }

  return await res.json();
};

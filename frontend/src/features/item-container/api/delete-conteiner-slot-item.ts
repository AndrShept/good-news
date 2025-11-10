import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const deleteContainerSlotItem = async ({
  id,
  containerSlotId,
  itemContainerId,
}: {
  id: string;
  containerSlotId: string;
  itemContainerId: string;
}) => {
  const res = await client.hero[':id']['item-container'][':itemContainerId'][':containerSlotId'].delete.$delete({
    param: {
      id,
      containerSlotId,
      itemContainerId,
    },
  });
  if (!res.ok) {
    return (await res.json()) as unknown as ErrorResponse;
  }

  return await res.json();
};

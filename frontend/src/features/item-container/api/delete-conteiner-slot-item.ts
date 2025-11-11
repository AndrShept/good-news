import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const deleteContainerSlotItem = async ({
  id,
  containerSlotId,
}: {
  id: string;
  containerSlotId: string;
}) => {
  const res = await client.hero[':id']['item-container']['slot-item'][':containerSlotId'].$delete({
    param: {
      id,
      containerSlotId,
    },
  });
  if (!res.ok) {
    return (await res.json()) as unknown as ErrorResponse;
  }

  return await res.json();
};

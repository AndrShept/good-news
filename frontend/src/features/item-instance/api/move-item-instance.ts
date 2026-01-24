import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const moveItemInstance = async ({
  id,
  itemInstanceId,
  from,
  to,
}: {
  id: string;
  itemInstanceId: string;
  from: string;
  to: string;
}) => {
  const res = await client.hero[':id']['item'][':itemInstanceId']['move']['$post']({
    param: { id, itemInstanceId },
    json: {
      from,
      to,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message);
  }

  return await res.json();
};

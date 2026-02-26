import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const itemConsume = async ({ heroId, itemInstanceId }: { heroId: string; itemInstanceId: string; }) => {
  const res = await client.hero[':id'].item[':itemInstanceId'].consume.$post({
    param: {
      id: heroId,
      itemInstanceId,
    },
  });
  if (!res.ok) {
    const err = (await res.json()) as unknown as ErrorResponse;
    throw new Error(err.message, { cause: { canShow: err.canShow } });
  }

  return await res.json();
};

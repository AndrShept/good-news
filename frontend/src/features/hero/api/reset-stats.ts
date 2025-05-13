import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const resetStats = async (id: string) => {
  const res = await client.hero[':id'].stats.reset.$put({
    param: {
      id,
    },
  });
  if (!res.ok) {
    return (await res.json()) as ErrorResponse;
  }

  return await res.json();
};

import { client } from '@/lib/utils';
import { changeStatSchema, ErrorResponse } from '@/shared/types';
import { z } from 'zod';


export const confirmStats = async (id: string, data: z.infer<typeof changeStatSchema>) => {

  const res = await client.hero[':id'].stats.confirm.$put({
    param: {
      id,
    },
    json: data,
  });
  if (!res.ok) {
    return (await res.json()) as unknown as ErrorResponse;
  }

  return await res.json();
};

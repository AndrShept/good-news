import { client } from '@/lib/utils';
import { ErrorResponse, statsSchema } from '@/shared/types';
import { z } from 'zod';

export const extendedStatsSchema = statsSchema.extend({
  freeStatPoints: z.number(),
});
type StatsData = z.infer<typeof extendedStatsSchema>;
export const confirmStats = async (id: string, data: z.infer<typeof extendedStatsSchema>) => {
  const transformedData = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.toString()])) as Record<
    keyof StatsData,
    string
  >;
  const res = await client.hero[':id'].stats.confirm.$put({
    param: {
      id,
    },
    form: transformedData,
  });
  if (!res.ok) {
    return (await res.json()) as unknown as ErrorResponse;
  }

  return await res.json();
};

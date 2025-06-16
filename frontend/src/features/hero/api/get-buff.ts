import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getBuff = async (id: string) => {
  try {
    const res = await client.hero[':id'].buffs.$get({
      param: { id },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getBuffOptions = (id: string) =>
  queryOptions({
    queryKey: ['buff'],
    queryFn: () => getBuff(id),
    staleTime: 60_000,
  });

import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getTown = async (id: string) => {
  try {
    const res = await client.town[':id'].$get({
      param: {
        id,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getTownOptions = (id: string) =>
  queryOptions({
    queryKey: ['town', id],
    queryFn: () => getTown(id),
    enabled: !!id,
  });

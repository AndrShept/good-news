import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getTile = async (id: string) => {
  try {
    const res = await client.tile[':id'].$get({
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

export const getTileOptions = (tileId: string) =>
  queryOptions({
    queryKey: ['tile', tileId],
    queryFn: () => getTile(tileId),
    enabled: !!tileId,
    staleTime: 0,
    gcTime: 0,
  });

import { client } from '@/lib/utils';
import { MapNameType } from '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

export const getMap = async (id: string) => {
  try {
    const res = await client.map[':id'].$get({
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

export const getMapOptions = (mapId: string) =>
  queryOptions({
    queryKey: ['map', mapId],
    queryFn: () => getMap(mapId),
    enabled: !!mapId,
    staleTime: Infinity  ,
    refetchOnWindowFocus: false
  });

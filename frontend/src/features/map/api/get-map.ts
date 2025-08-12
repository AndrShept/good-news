import { client } from '@/lib/utils';
import { MapNameType } from '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

export const getMap = async (name: MapNameType) => {
  try {
    const res = await client.map[':name'].$get({
      param: {
        name,
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

export const getMapOptions = (mapName: MapNameType) =>
  queryOptions({
    queryKey: ['map', mapName],
    queryFn: () => getMap(mapName),

    staleTime: 0,
  });

import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getMapHeroesLocation = async (id: string) => {
  try {
    const res = await client.map[':id'].heroes.$get({
      param: {
        id,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'data no found');
    }
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMapHeroesLocationOptions = (mapId: string) =>
  queryOptions({
    queryKey: ['map', mapId, 'heroes'],
    queryFn: () => getMapHeroesLocation(mapId),
    enabled: !!mapId,
    staleTime: 0,
  });

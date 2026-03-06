import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getMapChunkEntities = async (id: string) => {
  try {
    const res = await client.map[':id'].entities.$get({
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

export const getMapChunkEntitiesOptions = (mapId: string) =>
  queryOptions({
    queryKey: ['map', mapId, 'entities'],
    queryFn: () => getMapChunkEntities(mapId),
    enabled: !!mapId,
    staleTime: 0,
  });

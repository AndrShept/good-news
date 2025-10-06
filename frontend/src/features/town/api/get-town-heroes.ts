import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getTownHeroesLocation = async (id: string) => {
  try {
    const res = await client.town[':id'].heroes.$get({
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

export const getTownHeroesLocationOptions = (townId: string) =>
  queryOptions({
    queryKey: ['town', townId, 'heroes'],
    queryFn: () => getTownHeroesLocation(townId),
    enabled: !!townId,
    staleTime: 0,
  });

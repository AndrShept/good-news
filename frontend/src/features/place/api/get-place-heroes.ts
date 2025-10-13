import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getPlaceHeroesLocation = async (id: string) => {
  try {
    const res = await client.place[':id'].heroes.$get({
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

export const getPlaceHeroesLocationOptions = (placeId: string) =>
  queryOptions({
    queryKey: ['place', placeId, 'heroes'],
    queryFn: () => getPlaceHeroesLocation(placeId),
    enabled: !!placeId,
    staleTime: 0,
  });

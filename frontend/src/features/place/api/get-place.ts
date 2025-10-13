import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getPlace = async (id: string) => {
  try {
    const res = await client.place[':id'].$get({
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

export const getPlaceOptions = (id: string) =>
  queryOptions({
    queryKey: ['place', id],
    queryFn: () => getPlace(id),
    enabled: !!id,
  });

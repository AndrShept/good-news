import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getHero = async () => {
  try {
    const res = await client.hero.$get();
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getHeroOptions = () =>
  queryOptions({
    queryKey: ['hero'],
    queryFn: getHero,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 30, //30 min
  });

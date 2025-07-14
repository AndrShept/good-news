import { client } from '@/lib/utils';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

export const getGroupAvailableHeroes = async (page: number) => {
  try {
    const res = await client.group['available-heroes'].$get({
      query: {
        page: page.toString(),
      },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getGroupAvailableHeroesOptions = () =>
  infiniteQueryOptions({
    queryKey: ['group-available-heroes'],
    queryFn: ({ pageParam }) => getGroupAvailableHeroes(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage?.pagination.isMore) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    staleTime: 60_000,
  });

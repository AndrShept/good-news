import { client } from '@/lib/utils';
import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';

export const getGroupAvailableHeroes = async ({ page, searchTerm }: { page: number; searchTerm: string }) => {
  try {
    const res = await client.group['available-heroes'].$get({
      query: {
        page: page.toString(),
        searchTerm,
      },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getGroupAvailableHeroesOptions = ({ searchTerm }: { searchTerm: string }) =>
  infiniteQueryOptions({
    queryKey: ['group-available-heroes', searchTerm],
    queryFn: ({ pageParam }) => getGroupAvailableHeroes({ page: pageParam, searchTerm }),
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    gcTime: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage?.pagination.isMore) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    staleTime: 0,
  });

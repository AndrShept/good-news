import { client } from '@/lib/utils';
import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';

export const getGroupAvailableHeroes = async ({ page, searchTerm, selfId }: { page: number; searchTerm: string; selfId: string }) => {
  try {
    const res = await client.group['available-heroes'].$get({
      query: {
        page: page.toString(),
        searchTerm,
        selfId,
      },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getGroupAvailableHeroesOptions = ({ searchTerm, selfId }: { searchTerm: string; selfId: string }) =>
  infiniteQueryOptions({
    queryKey: ['group-available-heroes', searchTerm],
    queryFn: ({ pageParam }) => getGroupAvailableHeroes({ page: pageParam, searchTerm, selfId }),
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

import { client } from '@/lib/utils';
import { paginationSchema } from '@/shared/types';
import { infiniteQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { z } from 'zod';

export const getPosts = async (query?: Partial<z.infer<typeof paginationSchema>>) => {
  // await new Promise(r => setTimeout(r , 2000))
  const res = await client.post.$get({
    query: { ...query, limit: query?.limit?.toString(), page: query?.page?.toString() },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const getPostsQueryOptions = (query?: z.infer<typeof paginationSchema>) =>
  infiniteQueryOptions({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => {
      return getPosts({ ...query, page: pageParam });
    },
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) return undefined;
      return lastPageParam + 1;
    },
  });
import { client } from '@/lib/utils';
import { paginationSchema } from '@/shared/types';
import { infiniteQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { z } from 'zod';

export const getPostComments = async ({ postId, query }: { postId: string; query: z.infer<typeof paginationSchema> }) => {
  
  const res = await client.post[':id'].comment.$get({
    query: {
      ...query,
      limit: query?.limit.toString(),
      page: query?.page.toString(),
    },
    param: {
      id: postId,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const getPostCommentsQueryOptions = ({ postId, query }: { postId: string; query: z.infer<typeof paginationSchema> }) =>
  infiniteQueryOptions({
    queryKey: ['post', 'comments', postId, query.order, query.sortBy],
    queryFn: ({ pageParam }) =>
      getPostComments({
        postId,
        query: { ...query, page: pageParam },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

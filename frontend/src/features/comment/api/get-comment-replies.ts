import { client } from '@/lib/utils';
import { paginationSchema } from '@/shared/types';
import { infiniteQueryOptions } from '@tanstack/react-query';
import { z } from 'zod';

export const getCommentReplies = async ({ id, query }: { id: string; query: z.infer<typeof paginationSchema> }) => {
  // await new Promise((r) => setTimeout(r, 2000));
  const res = await client.comment[':id'].comments.$get({
    param: {
      id,
    },
    query: { ...query, limit: query.limit.toString(), page: query.page.toString() },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const getCommentRepliesQueryOptions = ({ id, query }: { id: string; query: z.infer<typeof paginationSchema> }) => {
  return infiniteQueryOptions({
    queryKey: ['post', 'comment', 'replys', id],
    queryFn: ({ pageParam }) => {
      return getCommentReplies({
        id: id.toString(),
        query: {
          ...query,
          page: pageParam,
        },
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
};

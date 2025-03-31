import { createCommentSchema, paginationSchema } from '@/shared/types';
import { infiniteQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { z } from 'zod';

import { client } from './api';

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
      console.log(pageParam);
      return getCommentReplies({
        id: id.toString(),
        query: {
          ...query,
          page: pageParam,
        },
      });
    },
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
};

export const createCommentReplies = async ({ id, form }: { id: string; form: z.infer<typeof createCommentSchema> }) => {
  const res = await client.comment[':id'].$post({
    param: {
      id,
    },
    form,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
};

import { Post, createPostSchema, paginationSchema } from '@/shared/types';
import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { client } from './api';

export const getPosts = async (query?: Partial<z.infer<typeof paginationSchema>>) => {
  // await new Promise(r => setTimeout(r , 2000))
  const res = await client.post.$get({
    query: { ...query, limit: query?.limit?.toString(), page: query?.page?.toString() },
  });
  return await res.json();
};
export const createPost = async (form: z.infer<typeof createPostSchema>) => {
  const res = await client.post.$post({
    form,
  });
  return await res.json();
};

export const getPostsQueryOptions = (query?: z.infer<typeof paginationSchema>) =>
  infiniteQueryOptions({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => {
      return getPosts({ ...query, page: pageParam });
    },
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    // staleTime: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) return undefined;
      return lastPageParam + 1;
    },
  });

export const upvotePost = async (postId: string) => {
  await new Promise((r) => setTimeout(r, 2000));
  const res = await client.post[':id'].upvote.$post({
    param: {
      id: postId,
    },
  });
  if (res.ok) {
    return await res.json();
  }
  const data = await res.json();
  throw new Error(data.message);
};

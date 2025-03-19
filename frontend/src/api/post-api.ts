import { Post, createPostSchema, paginationSchema } from '@/shared/types';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { client } from './api';

export const getPosts = async (query?: z.infer<typeof paginationSchema>) => {
  const res = await client.post.$get({
    query: { ...query, limit: query?.limit.toString(), page: query?.page.toString() },
  });
  return await res.json();
};
export const createPost = async (form: z.infer<typeof createPostSchema>) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const res = await client.post.$post({
    form,
  });
  return await res.json();
};

export const getPostsQueryOptions = (query?: z.infer<typeof paginationSchema>) =>
  infiniteQueryOptions({
    queryKey: ['posts'],
    queryFn: () => getPosts(query),
    initialPageParam: 1,
    staleTime: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) return undefined;
      console.log(lastPage.pagination.totalPages)
      return lastPageParam + 1;
    },
  });

export const upvotePost = async (postId: string) => {
  const res = await client.post[':id'].upvote.$post({
    param: {
      id: postId,
    },
  });
  return await res.json();
};

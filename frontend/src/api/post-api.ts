import { Post, createCommentSchema, createPostSchema, paginationSchema } from '@/shared/types';
import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { client } from './api';

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
export const getPost = async (postId: string) => {
  const res = await client.post[':id'].$get({
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

export const createPost = async (form: z.infer<typeof createPostSchema>) => {
  const res = await client.post.$post({
    form,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const createPostComment = async ({ id, form }: { id: string; form: z.infer<typeof createCommentSchema> }) => {
  const res = await client.post[':id'].comment.$post({
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

export const upvotePost = async (postId: string) => {
  // await new Promise((r) => setTimeout(r, 2000));
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
export const upvoteComment = async (commentId: string) => {
  // await new Promise((r) => setTimeout(r, 2000));
  // throw new Error('TOTOTO')
  const res = await client.comment[':id'].upvote.$post({
    param: {
      id: commentId,
    },
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

export const getPostQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    placeholderData: keepPreviousData,
  });

export const getPostCommentsQueryOptions = ({ postId, query }: { postId: string; query: z.infer<typeof paginationSchema> }) =>
  infiniteQueryOptions({
    queryKey: ['post', 'comments', postId, query.order, query.sortBy],
    queryFn: ({ pageParam }) =>
      getPostComments({
        postId,
        query: { ...query, page: pageParam },
      }),
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

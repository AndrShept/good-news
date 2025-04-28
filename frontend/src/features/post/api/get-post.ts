import { client } from '@/lib/utils';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';

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
export const getPostQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    placeholderData: keepPreviousData,
  });

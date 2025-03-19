import { getPostsQueryOptions } from '@/api/post-api';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

export const TopPage = () => {
  const queryClient = useQueryClient();
  const posts = queryClient.getQueryData(getPostsQueryOptions().queryKey);
  console.log(posts?.data);
  return <div>TopPage</div>;
};

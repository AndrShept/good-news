import { getPostCommentsQueryOptions, getPostQueryOptions } from '@/api/post-api';
import { paginationSchema } from '@/shared/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { SendHorizonalIcon } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router';

import { ContentInput } from '../ContentInput';
import { Spinner } from '../Spinner';
import { PostCard } from '../post/PostCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const PostPage = () => {
  const { postId } = useParams();
  const postQuery = useQuery(getPostQueryOptions(postId ?? ''));
  const query = paginationSchema.parse(paginationSchema);
  const postCommentsQuery = useInfiniteQuery(
    getPostCommentsQueryOptions({
      postId: postId ?? '',
      query,
    }),
  );
  console.log(postCommentsQuery.data);

  if (postQuery.isLoading)
    return (
      <div className="flex size-full">
        <Spinner />
      </div>
    );
  if (!postQuery.data) return;
  return (
    <section className="flex flex-col gap-4">
      {postQuery.data.data && <PostCard post={postQuery.data.data} />}
      <ContentInput />
    </section>
  );
};

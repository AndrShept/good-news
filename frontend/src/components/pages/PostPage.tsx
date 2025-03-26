import { useCreatePostComment } from '@/api/hooks/useCreatePostComment';
import { getPostCommentsQueryOptions, getPostQueryOptions } from '@/api/post-api';
import { paginationSchema } from '@/shared/types';
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';

import { CreateCommentForm } from '../CreateCommentForm';
import { Spinner } from '../Spinner';
import { CommentCard } from '../comment/CommentCard';
import { PostCard } from '../post/PostCard';

export const PostPage = () => {
  const { postId } = useParams();
  const postQuery = useSuspenseQuery(getPostQueryOptions(postId ?? ''));
  const query = paginationSchema.parse(paginationSchema);
  const postCommentsQuery = useSuspenseInfiniteQuery(
    getPostCommentsQueryOptions({
      postId: postId ?? '',
      query,
    }),
  );
  const { mutate, isPending } = useCreatePostComment();

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
      <CreateCommentForm isButtonDisable={isPending} onCreate={mutate} id={postQuery.data.data?.id.toString() ?? ''} />
      <ul className='flex flex-col gap-2'>{postCommentsQuery.data.pages.map((page) => page.data.map((comment) => <CommentCard key={comment.id} comment={comment} />))}</ul>
    </section>
  );
};

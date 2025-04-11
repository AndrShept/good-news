import { useCreateComment } from '@/api/hooks/useCreatePostComment';
import { createPostComment, getPostCommentsQueryOptions, getPostQueryOptions } from '@/api/post-api';
import { CreateCommentForm } from '@/components/CreateCommentForm';
import { InfinityScrollComponent } from '@/components/InfinityScrollComponent';
import { SortByFilter } from '@/components/SortByFilter';
import { Spinner } from '@/components/Spinner';
import { CommentCard } from '@/components/comment/CommentCard';
import { PostCard } from '@/components/post/PostCard';
import { childrenVariants, parentVariants } from '@/lib/animation';
import { paginationSchema } from '@/shared/types';
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import * as m from 'motion/react-m';
import React from 'react';

import { SearchSchema } from '..';

export const Route = createFileRoute('/(home)/post/$postId')({
  component: PostPage,
  validateSearch: zodValidator(SearchSchema),
});

export function PostPage() {
  const { postId } = Route.useParams();
  const { order, sortBy } = Route.useSearch();
  const postQuery = useSuspenseQuery(getPostQueryOptions(postId ?? ''));
  const query = paginationSchema.parse(paginationSchema);
  const postCommentsQuery = useSuspenseInfiniteQuery(
    getPostCommentsQueryOptions({
      postId: postId ?? '',
      query: { ...query, order, sortBy },
    }),
  );
  const { mutate, isPending } = useCreateComment({
    queryKey: [
      ['post', 'comments', postId as string],
      ['post', postId as string],
    ],
    mutationFn: createPostComment,
  });

  return (
    <section className="flex flex-col gap-4">
      {postQuery.data.data && <PostCard post={postQuery.data.data} />}
      <CreateCommentForm isButtonDisable={isPending} onCreate={mutate} id={postQuery.data.data?.id.toString() ?? ''} />
      <SortByFilter order={order} sortBy={sortBy} />
      <InfinityScrollComponent
        fetchNextPage={postCommentsQuery.fetchNextPage}
        hasNextPage={postCommentsQuery.hasNextPage}
        isFetchingNextPage={postCommentsQuery.isFetchingNextPage}
      >
        <m.ul variants={parentVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
          {postCommentsQuery.data.pages.map((page) => page.data.map((comment) => <CommentCard key={comment.id} comment={comment} />))}
        </m.ul>
      </InfinityScrollComponent>
    </section>
  );
}

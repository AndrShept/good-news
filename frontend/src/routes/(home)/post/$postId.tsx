import { useCreateComment } from '@/api/hooks/useCreatePostComment';
import { createPostComment, getPostCommentsQueryOptions, getPostQueryOptions } from '@/api/post-api';
import { CreateCommentForm } from '@/components/CreateCommentForm';
import { InfinityScrollComponent } from '@/components/InfinityScrollComponent';
import { Spinner } from '@/components/Spinner';
import { CommentCard } from '@/components/comment/CommentCard';
import { PostCard } from '@/components/post/PostCard';
import { paginationSchema } from '@/shared/types';
import { useQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/(home)/post/$postId')({
  component: PostPage,
});

export function PostPage() {
  const { postId } = Route.useParams();
  const postQuery = useSuspenseQuery(getPostQueryOptions(postId ?? ''));
  const query = paginationSchema.parse(paginationSchema);
  const postCommentsQuery = useSuspenseInfiniteQuery(
    getPostCommentsQueryOptions({
      postId: postId ?? '',
      query,
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
      <InfinityScrollComponent
        fetchNextPage={postCommentsQuery.fetchNextPage}
        hasNextPage={postCommentsQuery.hasNextPage}
        isFetchingNextPage={postCommentsQuery.isFetchingNextPage}
      >
        <ul className="flex flex-col gap-2">
          {postCommentsQuery.data.pages.map((page) => page.data.map((comment) => <CommentCard key={comment.id} comment={comment} />))}
        </ul>
      </InfinityScrollComponent>
    </section>
  );
}

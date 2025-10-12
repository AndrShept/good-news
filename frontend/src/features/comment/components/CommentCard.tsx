import { CommentIcon } from '@/components/CommentIcon';
import { CreateCommentForm } from '@/components/CreateCommentForm';
import { InfinityScrollComponent } from '@/components/InfinityScrollComponent';
import { Spinner } from '@/components/Spinner';
import { UpvoteIcon } from '@/components/UpvoteIcon';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { useUpvoteComment } from '@/features/comment/hooks/useUpvoteComment';
import { useCreateComment } from '@/features/post/components/useCreatePostComment';
import { getFormatDateTime } from '@/lib/utils';
import { Comments, paginationSchema } from '@/shared/types';
import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as m from 'motion/react-m';
import React, { memo, useState } from 'react';

import { createCommentReplies } from '../api/create-commnet-replies';
import { getCommentRepliesQueryOptions } from '../api/get-comment-replies';
import { childrenVariants } from '@/lib/config';

interface Props {
  comment: Comments;
}

export const CommentCard = memo(function CommentCard({ comment }: Props) {
  const { mutate } = useUpvoteComment({
    queryKey: comment.parentCommentId
      ? ['post', 'comment', 'replys', comment.parentCommentId.toString()]
      : ['post', 'comments', comment.postId.toString()],
  });
  const [isCommentFormShow, setIsCommentFormShow] = useState(false);

  const query = paginationSchema.parse(paginationSchema);
  const [isReplyShow, setIsReplyShow] = useState(false);
  const replys = useInfiniteQuery({
    ...getCommentRepliesQueryOptions({
      id: `${comment.id}`,
      query,
    }),
    enabled: isReplyShow,
  });
  const createCommentReplys = useCreateComment({
    queryKey: [
      ['post', 'comment', 'replys', `${comment.id}`],
      comment.parentCommentId ? ['post', 'comment', 'replys', comment.parentCommentId.toString()] : [],
      ['post', 'comments', comment.postId.toString()],
      ['post', comment.postId.toString()],
    ],
    mutationFn: createCommentReplies,
  });

  return (
    <m.li variants={childrenVariants} className="flex flex-col gap-2 rounded">
      <section className="hover:bg-secondary/30 flex gap-2 p-3">
        <div>
          <UserAvatar url={comment.author?.image} />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center gap-1">
            <p>{comment.author?.username}</p>
            <p className="text-muted-foreground/40 text-xs">{getFormatDateTime(comment?.createdAt)}</p>
          </div>
          <p className="text-muted-foreground text-sm">{comment.content}</p>
          <div className="flex items-center gap-1">
            <UpvoteIcon onUpvote={() => mutate(comment.id.toString())} points={comment.points} isUpvoted={comment.isUpvoted} />
            <CommentIcon commentCount={comment.commentCount} onClick={() => setIsCommentFormShow((prev) => !prev)} />
          </div>
          {isCommentFormShow && (
            <CreateCommentForm
              isButtonDisable={createCommentReplys.isPending}
              id={comment.id.toString()}
              isUserAvatar={true}
              onCreate={createCommentReplys.mutate}
              className="mb-5 mt-2"
              onHide={() => setIsCommentFormShow(false)}
            />
          )}

          {!isReplyShow && !!comment.commentCount && (
            <Button onClick={() => setIsReplyShow((prev) => !prev)} className="text-muted-foreground w-fit" variant={'link'}>
              <ChevronDown />
              Reply {comment.commentCount}
            </Button>
          )}
          {isReplyShow && !comment.parentCommentId && (
            <Button onClick={() => setIsReplyShow(false)} className="w-fit text-green-500" variant={'link'}>
              <ChevronUp /> Hide
            </Button>
          )}
        </div>
      </section>
      {replys.isLoading && <Spinner size={'sm'} />}
      {!replys.isLoading && isReplyShow && (
        <div className="flex">
          <div className="bg-muted ml-8 mr-2 w-[0.5px]"></div>
          <InfinityScrollComponent
            fetchNextPage={replys.fetchNextPage}
            hasNextPage={replys.hasNextPage}
            isFetchingNextPage={replys.isFetchingNextPage}
          >
            <section className="w-full">
              {replys.data?.pages.map((page) => page.data.map((comment) => <CommentCard key={comment.id} comment={comment} />))}
            </section>
          </InfinityScrollComponent>
        </div>
      )}
    </m.li>
  );
});

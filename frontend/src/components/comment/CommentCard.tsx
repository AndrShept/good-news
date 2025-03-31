import { createCommentReplies, getCommentRepliesQueryOptions } from '@/api/comment-api';
import { useCreateComment } from '@/api/hooks/useCreatePostComment';
import { useUpvoteComment } from '@/api/hooks/useUpvoteComment';
import { getFormatDateTime } from '@/lib/utils';
import { Comments, paginationSchema } from '@/shared/types';
import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { CommentIcon } from '../CommentIcon';
import { CreateCommentForm } from '../CreateCommentForm';
import { InfinityScrollComponent } from '../InfinityScrollComponent';
import { Spinner } from '../Spinner';
import { UpvoteIcon } from '../UpvoteIcon';
import { UserAvatar } from '../UserAvatar';
import { Button } from '../ui/button';

interface Props {
  comment: Comments;
}

export const CommentCard = ({ comment }: Props) => {
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
    <li className="flex flex-col gap-2 rounded">
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
              onCreate={createCommentReplys.mutate}
              className="mb-5 mt-2"
              onHide={() => setIsCommentFormShow(false)}
            />
          )}

          {!isReplyShow && !!comment.commentCount && (
            <Button onClick={() => setIsReplyShow((prev) => !prev)} className="w-fit" variant={'link'}>
              reply {comment.commentCount}
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
            <section className='w-full' >
              {replys.data?.pages.map((page) => page.data.map((comment) => <CommentCard comment={comment} />))}
            </section>
          </InfinityScrollComponent>
        </div>
      )}
      {isReplyShow && !comment.parentCommentId && (
        <Button onClick={() => setIsReplyShow(false)} className="w-fit" variant={'link'}>
          hide
        </Button>
      )}
    </li>
  );
};

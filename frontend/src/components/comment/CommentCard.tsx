import { getCommentRepliesQueryOptions } from '@/api/comment-api';
import { useCreateCommentReplys } from '@/api/hooks/useCreateCommentReplys';
import { useUpvote } from '@/api/hooks/useUpvote';
import { useUpvoteComment } from '@/api/hooks/useUpvoteComment';
import { getFormatDateTime } from '@/lib/utils';
import { Comments, paginationSchema } from '@/shared/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { CommentIcon } from '../CommentIcon';
import { CreateCommentForm } from '../CreateCommentForm';
import { UpvoteIcon } from '../UpvoteIcon';
import { UserAvatar } from '../UserAvatar';
import { Button } from '../ui/button';

interface Props {
  comment: Comments;
}

export const CommentCard = ({ comment }: Props) => {
  const { mutate } = useUpvoteComment({ parentId: comment.postId });
  const query = paginationSchema.parse(paginationSchema);
  const [isReplyShow, setIsReplyShow] = useState(false);
  console.log(comment);
  // const like = useUpvote({ parentId: comment.postId, type: 'comment' });
  const replys = useInfiniteQuery({
    ...getCommentRepliesQueryOptions({
      id: comment.id,
      query,
    }),
    enabled: isReplyShow,
  });
  const createCommentReplys = useCreateCommentReplys();
  const [isCommentFormShow, setIsCommentFormShow] = useState(false);
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
            />
          )}
        </div>
      </section>
      {!isReplyShow && !!comment.commentCount && (
        <Button onClick={() => setIsReplyShow((prev) => !prev)} className="w-fit" variant={'link'}>
          reply {comment.commentCount}
        </Button>
      )}
      <section className="ml-4">{replys.data?.pages.map((page) => page.data.map((comment) => <CommentCard comment={comment} />))}</section>
    </li>
  );
};

import { useUpvoteComment } from '@/api/hooks/useUpvoteComment';
import { getFormatDateTime } from '@/lib/utils';
import { Comments } from '@/shared/types';
import React from 'react';

import { UpvoteIcon } from '../UpvoteIcon';
import { UserAvatar } from '../UserAvatar';

interface Props {
  comment: Comments;
}

export const CommentCard = ({ comment }: Props) => {
  const { mutate } = useUpvoteComment({ parentId: comment.postId });
  return (
    <li className="flex gap-2">
      <div>
        <UserAvatar url={comment.author?.image} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <p>{comment.author?.username}</p>
          <p className="text-muted-foreground/40 text-xs">{getFormatDateTime(comment?.createdAt)}</p>
        </div>
        <p className="text-muted-foreground text-sm">{comment.content}</p>
        <div>
          <UpvoteIcon onUpvote={() => mutate(comment.id.toString())} points={comment.points} isUpvoted={comment.isUpvoted} />
        </div>
      </div>
    </li>
  );
};

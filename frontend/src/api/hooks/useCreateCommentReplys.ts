import { useMutation } from '@tanstack/react-query';

import { createCommentReplies } from '../comment-api';

export const useCreateCommentReplys = () => {
  return useMutation({
    mutationFn: createCommentReplies,
  });
};

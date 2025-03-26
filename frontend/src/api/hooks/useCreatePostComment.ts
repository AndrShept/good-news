import { Comments, Post, SuccessResponse } from '@/shared/types';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { createPostComment, getPostQueryOptions } from '../post-api';

export const useCreatePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPostComment,

    async onMutate({ form, id }) {
      let prevCommentsData;
      let prevPostData;
      await queryClient.cancelQueries({
        queryKey: ['comments', id],
      });

      queryClient.setQueriesData<SuccessResponse<Post>>(
        {
          queryKey: getPostQueryOptions(id).queryKey,
        },
        (oldData) => {
          prevPostData = oldData;
          if (!oldData || !oldData.data) return;
          return { ...oldData, data: { ...oldData.data, commentCount: oldData.data.commentCount + 1 } };
        },
      );
      queryClient.setQueriesData<InfiniteData<SuccessResponse<Comments[]>>>(
        {
          queryKey: ['comments', id],
        },
        (oldData) => {
          if (!oldData) return;
          prevCommentsData = oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return {
                ...page,
                data: [form as Comments, ...page.data!],
              };
            }),
          };
        },
      );
      return { prevCommentsData, prevPostData };
    },
    onError(error, { id }, context) {
      queryClient.setQueriesData(
        {
          queryKey: ['comments', id],
        },
        () => context?.prevCommentsData,
      );
      queryClient.setQueriesData<SuccessResponse<Post>>(
        {
          queryKey: getPostQueryOptions(id).queryKey,
        },
        () => context?.prevPostData,
      );
    },
    onSettled(data, error, { id }, context) {
      queryClient.invalidateQueries({
        queryKey: ['comments', id],
      });

      queryClient.invalidateQueries({
        queryKey: getPostQueryOptions(id).queryKey,
      });
    },
  });
};

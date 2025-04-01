import { upvoteComment } from '@/api/post-api';
import { Comments, SuccessResponse } from '@/shared/types';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useUpvoteComment = ({ queryKey }: { queryKey: string[] }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upvoteComment,
    async onMutate(id) {
      let prevData;
      queryClient.setQueriesData<InfiniteData<SuccessResponse<Comments[]>>>(
        {
          queryKey,
        },
        (oldData) => {
          console.log(oldData);
          if (!oldData) return;
          prevData = oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return {
                ...page,
                data: page.data?.map((comment) => {
                  if (comment.id.toString() === id) {
                    return {
                      ...comment,
                      points: comment.isUpvoted ? comment.points - 1 : comment.points + 1,
                      isUpvoted: !comment.isUpvoted,
                    };
                  }
                  return comment;
                }),
              };
            }),
          };
        },
      );

      return { prevData };
    },
    onError: (err, newPost, context) => {
      toast.error('Something went wrong');
      queryClient.setQueriesData<InfiniteData<SuccessResponse<Comments[]>>>(
        {
          queryKey,
        },

        context?.prevData,
      );
    },

    onSuccess(data, variables) {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};


import { GetPostsData, PaginatedResponse, Post, SuccessResponse } from '@/shared/types';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getPostsQueryOptions } from '../api/get-posts';
import { upvotePost } from '../api/upvote-post';
import { getPostQueryOptions } from '../api/get-post';

export const useUpvotePost = () => {
  const queryClient = useQueryClient();
  const queryKey = getPostsQueryOptions().queryKey;

  return useMutation({
    mutationFn: upvotePost,
    async onMutate(id) {
      await queryClient.cancelQueries({ queryKey: ['post', id] });
      await queryClient.cancelQueries({ queryKey: [...queryKey] });

      queryClient.setQueriesData<SuccessResponse<Post>>(
        {
          queryKey: [...getPostQueryOptions(id).queryKey],
        },
        (oldData) => {
          if (!oldData) return;
          if (!oldData.data) return;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              isUpvoted: !oldData.data.isUpvoted,
              points: oldData.data.isUpvoted ? oldData.data.points - 1 : oldData.data.points + 1,
            },
          };
        },
      );
      let prevData;
      queryClient.setQueriesData<InfiniteData<PaginatedResponse<Post[]>>>({ queryKey }, (oldData) => {
        if (!oldData) return;
        prevData = oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === +id
                ? {
                    ...post,
                    points: post.isUpvoted ? post.points - 1 : post.points + 1,
                    isUpvoted: !post.isUpvoted,
                  }
                : post,
            ),
          })),
        };
      });

      return { prevData };
    },
    onError: (err, newPost, context) => {
      toast.error('Something went wrong');
      queryClient.setQueriesData<InfiniteData<GetPostsData>>(
        {
          queryKey,
        },

        context?.prevData,
      );
    },

    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries(getPostQueryOptions(variables));
    },
  });
};

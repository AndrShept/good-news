import { getPostsQueryOptions, upvotePost } from '@/api/post-api';
import { GetPostsData } from '@/shared/types';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpvotePost = () => {
  const queryClient = useQueryClient();
  const queryKey = getPostsQueryOptions().queryKey;

  return useMutation({
    mutationFn: upvotePost,
    async onMutate(id) {
      await queryClient.cancelQueries({ queryKey: [...queryKey, id] });
      let prevData;
      queryClient.setQueriesData<InfiniteData<GetPostsData>>({ queryKey }, (oldData) => {
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
      queryClient.setQueriesData<InfiniteData<GetPostsData>>(
        {
          queryKey,
        },
        () => {
          console.log(context?.prevData);
          return context?.prevData;
        },
      );
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

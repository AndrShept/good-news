import { getPostCommentsQueryOptions, getPostQueryOptions, getPostsQueryOptions, upvoteComment, upvotePost } from '@/api/post-api';
import { Comments, GetPostsData, PaginatedResponse, Post, SuccessResponse, paginationSchema } from '@/shared/types';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpvoteComment = ({ parentId }: { parentId: number }) => {
  const queryClient = useQueryClient();
  const query = paginationSchema.parse(paginationSchema);
  console.log();
  return useMutation({
    mutationFn: upvoteComment,
    async onMutate(id) {
      await queryClient.cancelQueries({
        queryKey: getPostCommentsQueryOptions({
          postId: parentId.toString(),
          query,
        }).queryKey,
      });

      let prevData;
      queryClient.setQueriesData<InfiniteData<SuccessResponse<Comments[]>>>(
        {
          queryKey: getPostCommentsQueryOptions({
            postId: parentId.toString(),
            query,
          }).queryKey,
        },
        (oldData) => {
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
      queryClient.setQueriesData<InfiniteData<SuccessResponse<Comments[]>>>(
        {
          queryKey: getPostCommentsQueryOptions({
            postId: parentId.toString(),
            query,
          }).queryKey,
        },
        () => {
          return context?.prevData;
        },
      );
    },


  });
};

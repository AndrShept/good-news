import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { upvotePost, upvoteComment, getPostQueryOptions, getPostsQueryOptions, getPostCommentsQueryOptions } from '@/api/post-api';
import { SuccessResponse, Post, Comments, PaginatedResponse, paginationSchema } from '@/shared/types';

type UpvoteType = 'post' | 'comment';

interface UseUpvoteOptions {
  type: UpvoteType;
  parentId?: number; // потрібно лише для коментарів
}

export const useUpvote = ({ type, parentId }: UseUpvoteOptions) => {
  const queryClient = useQueryClient();
  const query = paginationSchema.parse(paginationSchema)
  const getQueryKey = (id: string) => {
    if (type === 'post') return getPostQueryOptions(id).queryKey;
    if (type === 'comment' && parentId) {
      return getPostCommentsQueryOptions({ postId: parentId.toString(), query }).queryKey;
    }
    return [];
  };
  type UpvoteDataType = InfiniteData<PaginatedResponse<T extends 'post' ? Post[] : Comments[]>>;
  const mutationFn = type === 'post' ? upvotePost : upvoteComment;

  return useMutation({
    mutationFn,
    async onMutate(id: string) {
      await queryClient.cancelQueries({ queryKey: getQueryKey(id) });

      let prevData;
      queryClient.setQueriesData<UpvoteDataType>(
        { queryKey: getQueryKey(id) },
        (oldData) => {
          if (!oldData) return;
          prevData = oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((item) =>
                item.id.toString() === id
                  ? { ...item, points: item.isUpvoted ? item.points - 1 : item.points + 1, isUpvoted: !item.isUpvoted }
                  : item
              ),
            })),
          };
        }
      );

      return { prevData };
    },
    onError: (_, __, context) => {
      queryClient.setQueriesData({ queryKey: getQueryKey(context?.prevData?.pages[0]?.data[0]?.id) }, () => context?.prevData);
    },
    onSettled(_, __, variables) {
      queryClient.invalidateQueries({ queryKey: getQueryKey(variables) });
    },
  });
};

import { Comments, SuccessResponse, createCommentSchema } from '@/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { z } from 'zod';

export const useCreateComment = ({
  queryKey,
  mutationFn,
}: {
  queryKey: string[][];
  mutationFn: (data: { id: string; form: z.infer<typeof createCommentSchema> }) => Promise<SuccessResponse<Comments>>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,

    onError() {
      toast.error('Something went wrong');
    },
     onSettled() {
      queryKey.map((key) => {
        queryClient.invalidateQueries({
          queryKey: key,
        });
      });
    },
  });
};

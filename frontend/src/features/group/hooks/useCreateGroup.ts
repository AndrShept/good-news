import { getHeroOptions } from '@/features/hero/api/get-hero';
import { toastError } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createGroup } from '../api/create-group';

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGroup,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
    },
    onError: () => {
      toastError();
    },
  });
};

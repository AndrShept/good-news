import { getHeroOptions } from '@/features/hero/api/get-hero';
import { toastError } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteGroup } from '../api/delete-group';

export const useRemoveGroupMutation = ({ groupId }: { groupId: string }) => {
  return useMutation({
    mutationFn: deleteGroup,

    onError: () => {
      toastError();
    },
  });
};

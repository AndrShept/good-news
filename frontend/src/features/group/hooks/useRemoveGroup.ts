import { getHeroOptions } from '@/features/hero/api/get-hero';
import { toastError } from '@/lib/utils';
import { ApiHeroResponse } from '@/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteGroup } from '../api/delete-group';
import { getGroupMembersOptions } from '../api/get-group-members';

export const useRemoveGroup = ({ groupId }: { groupId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGroup,

    onSuccess: async () => {
      // await queryClient.invalidateQueries({
      //   queryKey: getHeroOptions().queryKey,
      // });
      queryClient.setQueriesData<ApiHeroResponse>({ queryKey: getHeroOptions().queryKey }, (oldData) => {
        if (!oldData || !oldData.data) {
          return;
        }
        return {
          ...oldData,
          data: { ...oldData.data, groupId: null },
        };
      });
    },
    onError: () => {
      toastError();
    },
  });
};

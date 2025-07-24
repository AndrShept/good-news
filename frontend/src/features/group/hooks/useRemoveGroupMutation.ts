import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useUpdateHero } from '@/features/hero/hooks/useUpdateHero';
import { toastError } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteGroup } from '../api/delete-group';
import { getGroupAvailableHeroesOptions } from '../api/get-group-available-heroes';

export const useRemoveGroupMutation = () => {
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getGroupAvailableHeroesOptions({
          searchTerm: '',
          selfId: heroId,
        }).queryKey,
      });
    },
    onError: () => {
      toastError();
    },
  });
};

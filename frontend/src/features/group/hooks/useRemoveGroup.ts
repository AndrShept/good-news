import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { ApiGroupMembersResponse, Hero } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

export const useRemoveGroup = () => {
  const queryClient = useQueryClient();
  const { updateHero } = useHeroUpdate();
  const clearGroupList = () => {
    queryClient.setQueriesData<ApiGroupMembersResponse>(
      {
        queryKey: ['group'],
      },
      (oldData) => {
        if (!oldData) return;

        return { ...oldData, data: [] };
      },
    );
    queryClient.removeQueries({
      queryKey: ['group'],
    });
  };
  const onRemove = () => {
    updateHero({
      groupId: undefined,
      group: undefined,
    });
    clearGroupList();
  };
  return {
    onRemove,
  };
};

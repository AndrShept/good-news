import { useUpdateHero } from '@/features/hero/hooks/useUpdateHero';
import { useQueryClient } from '@tanstack/react-query';

export const useRemoveGroup = () => {
  const queryClient = useQueryClient();
  const { updateHero } = useUpdateHero();
  const onRemove = () => {
    updateHero({
      groupId: undefined,
      group: undefined,
    });
    queryClient.resetQueries({
      queryKey: ['group'],
    });
  };
  return {
    onRemove,
  };
};

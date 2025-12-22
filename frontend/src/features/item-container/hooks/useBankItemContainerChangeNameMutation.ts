import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { changeNameItemContainer } from '../api/change-name-item-container';
import { getBankItemContainersOptions } from '../api/get-bank-item-containers';

export const useBankItemContainerChangeNameMutation = () => {
  const heroId = useHeroId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemContainerId, name }: { itemContainerId: string; name: string }) =>
      changeNameItemContainer(heroId, itemContainerId, name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getBankItemContainersOptions(heroId).queryKey });
    },
  });
};

import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { changeNameItemContainer } from '../api/change-item-container';
import { getBankItemContainersOptions } from '../api/get-bank-item-containers';

export const useBankItemContainerChangeMutation = () => {
  const heroId = useHeroId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemContainerId, data }: { itemContainerId: string; data: { name?: string; color?: string } }) =>
      changeNameItemContainer(heroId, itemContainerId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getBankItemContainersOptions(heroId).queryKey });
    },
  });
};

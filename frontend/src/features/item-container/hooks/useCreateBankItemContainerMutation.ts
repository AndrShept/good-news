import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createItemContainer } from '../api/create-item-container';
import { getBankItemContainersOptions } from '../api/get-bank-item-containers';

export const useCreateBankItemContainerMutation = () => {
  const queryClient = useQueryClient();
  const { updateHero } = useHeroUpdate();
  const heroId = useHeroId();
  return useMutation({
    mutationFn: () => createItemContainer(heroId),
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({
        queryKey: getBankItemContainersOptions(heroId).queryKey,
      });
      updateHero({
        premiumCoins: data?.newPremiumCoinsValue,
      });
    },
  });
};

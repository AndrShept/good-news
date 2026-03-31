import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { getPlaceOptions } from '@/features/place/api/get-place';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createItemContainer } from '../api/create-item-container';

export const useCreateBankItemContainerMutation = () => {
  const queryClient = useQueryClient();
  const { updateHero } = useHeroUpdate();
  const heroId = useHeroId();
  const placeId = useHero((data) => data?.location.placeId ?? '');
  return useMutation({
    mutationFn: () => createItemContainer(heroId),
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({
        queryKey: getPlaceOptions(placeId).queryKey,
      });
      updateHero({
        premiumCoins: data?.newPremiumCoinsValue,
      });
    },
  });
};

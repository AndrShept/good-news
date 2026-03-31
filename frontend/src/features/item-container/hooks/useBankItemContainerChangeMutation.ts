import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { changeNameItemContainer } from '../api/change-item-container';
import { useHero } from '@/features/hero/hooks/useHero';
import { getPlaceOptions } from '@/features/place/api/get-place';

export const useBankItemContainerChangeMutation = () => {
  const heroId = useHeroId();
  const queryClient = useQueryClient();
    const placeId = useHero((data) => data?.location.placeId ?? '');
  return useMutation({
    mutationFn: ({ itemContainerId, data }: { itemContainerId: string; data: { name?: string; color?: string } }) =>
      changeNameItemContainer(heroId, itemContainerId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey:  getPlaceOptions(placeId).queryKey, });
    },
  });
};

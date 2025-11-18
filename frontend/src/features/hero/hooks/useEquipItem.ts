import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { equipItem } from '../api/equip-Item';
import { getHeroOptions } from '../api/get-hero';
import { useHero } from './useHero';

export const useEquipItem = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHero((state) => state?.data?.id ?? '');
  const backpackId = useGetBackpackId();
  return useMutation({
    mutationFn: equipItem,

    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
      });
      setGameMessage({
        success: true,
        type: 'INFO',
        text: data.message,
        data: { gameItemName: data.data?.name ?? '' },
      });
    },
  });
};

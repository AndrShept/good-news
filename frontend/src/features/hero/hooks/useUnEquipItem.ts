import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { unEquipItem } from '../api/un-equip-Item';
import { useHero } from './useHero';

export const useUnEquipItem = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHero((state) => state?.data?.id ?? '');
  const { backpackId } = useHeroBackpack();
  return useMutation({
    mutationFn: unEquipItem,

    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getItemContainerOptions(heroId, backpackId ?? '').queryKey,
      });
      setGameMessage({
        success: true,
        type: 'success',
        text: data.message,
        data: { gameItemName: data.data?.gameItem?.name ?? '' },
      });
    },
  });
};

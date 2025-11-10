import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { unEquipItem } from '../api/un-equip-Item';
import { useHero } from './useHero';
import { getItemContainerByTypeOptions } from '@/features/item-container/api/get-item-container-by-type';

export const useUnEquipItem = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHero((state) => state?.data?.id ?? '');
  return useMutation({
    mutationFn: unEquipItem,

    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getItemContainerByTypeOptions(heroId, 'BACKPACK').queryKey,
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

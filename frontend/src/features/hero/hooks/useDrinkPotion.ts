import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { drinkPotion } from '../api/drinkPotion';
import { getBuffOptions } from '../api/get-buff';
import { getHeroOptions } from '../api/get-hero';
import { useHeroId } from './useHeroId';
import { getItemContainerByTypeOptions } from '@/features/item-container/api/get-item-container-by-type';

export const useDrinkPotion = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  return useMutation({
    mutationFn: drinkPotion,

    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getItemContainerByTypeOptions(heroId, 'BACKPACK').queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getBuffOptions(heroId).queryKey,
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

import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { drinkPotion } from '../api/drinkPotion';
import { getBuffOptions } from '../api/get-buff';
import { getHeroOptions } from '../api/get-hero';
import { useHeroId } from './useHeroId';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';

export const useDrinkPotion = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  return useMutation({
    mutationFn: drinkPotion,

    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
      await queryClient.invalidateQueries({
       queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
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

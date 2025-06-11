import { toastError } from '@/lib/utils';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { getInventoryOptions } from '../api/get-inventory';
import { useHero } from './useHero';
import { drinkPotion } from '../api/drinkPotion';

export const useDrinkPotion = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const { id: heroId } = useHero();
  return useMutation({
    mutationFn: drinkPotion,
    onError: () => {
      toastError();
    },
    async onSuccess(data) {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: getHeroOptions().queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: getInventoryOptions(heroId).queryKey,
        });
        setGameMessage({
          success: true,
          type: 'success',
          text: data.message,
        });
      } else {
        setGameMessage({
          success: false,
          type: 'error',
          text: data.message,
        });
      }
    },
  });
};

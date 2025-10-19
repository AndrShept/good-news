import { toastError } from '@/lib/utils';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { equipItem } from '../api/equip-Item';
import { getHeroOptions } from '../api/get-hero';
import { getInventoryOptions } from '../api/get-inventory';
import { useHero } from './useHero';

export const useEquipItem = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHero((state) => state?.data?.id ?? '');
  return useMutation({
    mutationFn: equipItem,

    async onSuccess(data) {
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
        data: { gameItemName: data.data?.name ?? '' },
      });
    },
  });
};

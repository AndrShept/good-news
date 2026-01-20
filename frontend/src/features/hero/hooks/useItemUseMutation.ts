import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';
import { itemUse } from '../api/item-use';
import { useHeroId } from './useHeroId';
import { useGameData } from './useGameData';
import { getBuffOptions } from '../api/get-buff';

export const useItemUseMutation = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  const { itemsTemplateById } = useGameData()
  return useMutation({
    mutationFn: ({ itemInstanceId }: { itemInstanceId: string, itemTemplateId: string }) => itemUse({ heroId, itemInstanceId }),

    async onSuccess(data, { itemTemplateId }) {
      const template = itemsTemplateById[itemTemplateId]

      queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
      });
      if (template.potionInfo?.type === 'BUFF') {
        queryClient.invalidateQueries({
          queryKey: getBuffOptions(heroId).queryKey,
        });
      }
      setGameMessage({
        success: true,
        type: 'INFO',
        text: data.message,
        data: [{ name: data.data?.name ?? '' }],
      });
    },
  });
};

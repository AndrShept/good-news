import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { buffTemplate, buffTemplateMapIds } from '@/shared/templates/buff-template';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getBuffOptions } from '../api/get-buff';
import { itemConsume } from '../api/item-consume';
import { useGameData } from './useGameData';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useItemConsumeMutation = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  const { updateHero } = useHeroUpdate();
  const { removeItemInstance, updateItemInstance } = useItemContainerUpdate();
  const { itemsTemplateById } = useGameData();
  return useMutation({
    mutationFn: ({ itemInstanceId }: { itemInstanceId: string; itemTemplateId: string }) => itemConsume({ heroId, itemInstanceId }),

    async onSuccess(data, { itemTemplateId }) {
      const template = itemsTemplateById[itemTemplateId];
      console.log(data)
      updateHero({
        ...data.data?.hero,
      });
      if (data.data?.itemsDelta) {
        for (const i of data.data.itemsDelta) {
          switch (i.type) {
            case 'DELETE':
              removeItemInstance(i.itemContainerId ?? '', i.itemInstanceId);
              break;
            case 'UPDATE':
              updateItemInstance(i.itemContainerId ?? '', i.itemInstanceId, i.updateData);
              break;
          }
        }
      }

      switch (template.type) {
        case 'POTION': {
          if (template.potionInfo?.type === 'BUFF') {
            queryClient.invalidateQueries({
              queryKey: getBuffOptions(heroId).queryKey,
            });
          }
          setGameMessage({
            success: true,
            type: 'INFO',
            text: data.data?.message ?? '',
            data: [{ name: data.data?.name ?? '' }],
          });
          break;
        }
        case 'SKILL_BOOK': {
          if (template.bookInfo?.kind === 'TRAIN_BUFF') {
            queryClient.invalidateQueries({
              queryKey: getBuffOptions(heroId).queryKey,
            });
          }

          setGameMessage({
            success: true,
            type: 'INFO',
            text: data.data?.message ?? '',
            data: [{ name: data.data?.name ??'' }],
          });

          break;
        }
      }
    },
  });
};

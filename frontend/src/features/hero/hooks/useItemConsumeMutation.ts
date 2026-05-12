import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { itemConsume } from '../api/item-consume';
import { useGameData } from './useGameData';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useItemConsumeMutation = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  const { updateHero, addBuff } = useHeroUpdate();
  const { updateItemByDeltaEvents } = useItemContainerUpdate();
  const { itemsTemplateById } = useGameData();
  return useMutation({
    mutationFn: ({ itemInstanceId }: { itemInstanceId: string; itemTemplateId: string }) => itemConsume({ heroId, itemInstanceId }),

    async onSuccess(data, { itemTemplateId }) {
      const template = itemsTemplateById[itemTemplateId];
      console.log(data);
      updateHero({
        ...data.data?.hero,
      });
      if (data.data?.itemsDelta) {
        updateItemByDeltaEvents(data.data.itemsDelta);
      }

      switch (template.type) {
        case 'POTION': {
          // if (template.potionInfo?.type === 'BUFF') {
          //     addBuff()
          // }
          setGameMessage({
            color: 'GREY',
            text: data.data?.message ?? '',
            data: [{ name: data.data?.name ?? '' }],
          });
          break;
        }
        case 'SKILL_BOOK': {
          // if (template.bookInfo?.kind === 'TRAIN_BUFF') {

          // }

          setGameMessage({
            color: 'GREY',
            text: data.data?.message ?? '',
            data: [{ name: data.data?.name ?? '' }],
          });

          break;
        }
      }
    },
  });
};

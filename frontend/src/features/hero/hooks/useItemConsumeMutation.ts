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
  const heroId = useHeroId();
  const { updateHero, addBuff } = useHeroUpdate();
  const { updateItemByDeltaEvents } = useItemContainerUpdate();
  const { itemsTemplateById } = useGameData();
  return useMutation({
    mutationFn: ({ itemInstanceId }: { itemInstanceId: string; itemTemplateId: string }) => itemConsume({ heroId, itemInstanceId }),

    async onSuccess({ data }, { itemTemplateId }) {
      if (!data) return;
      const template = itemsTemplateById[itemTemplateId];
      updateHero({
        ...data.hero,
      });
      if (data.itemsDelta) {
        updateItemByDeltaEvents(data.itemsDelta);
      }

      switch (template.type) {
        case 'POTION': {
          if (template.potionInfo?.type === 'BUFF' && data.buff) {
            addBuff(data.buff);
          }
          setGameMessage({
            color: 'GREY',
            text: data.message ?? '',
            data: [{ name: data.name ?? '' }],
          });
          break;
        }
        case 'SKILL_BOOK': {
          if (template.bookInfo?.kind === 'TRAIN_BUFF' && data.buff) {
            addBuff(data.buff);
          }

          setGameMessage({
            color: 'GREY',
            text: data.message ?? '',
            data: [{ name: data.name ?? '' }],
          });

          break;
        }
      }
    },
  });
};

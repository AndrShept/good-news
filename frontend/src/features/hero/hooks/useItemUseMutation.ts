import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { buffTemplate, buffTemplateMapIds } from '@/shared/templates/buff-template';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getBuffOptions } from '../api/get-buff';
import { itemUse } from '../api/item-use';
import { useGameData } from './useGameData';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useItemUseMutation = () => {
  const setGameMessage = useSetGameMessage();
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  const { updateHero } = useHeroUpdate();
  const { updateItemContainer } = useItemContainerUpdate();
  const { itemsTemplateById } = useGameData();
  return useMutation({
    mutationFn: ({ itemInstanceId }: { itemInstanceId: string; itemTemplateId: string }) => itemUse({ heroId, itemInstanceId }),

    async onSuccess(data, { itemTemplateId }) {
      const template = itemsTemplateById[itemTemplateId];

      switch (template.type) {
        case 'ACCESSORY':
        case 'ARMOR':
        case 'SHIELD':
        case 'TOOL':
        case 'WEAPON':
          updateHero({
            ...data.data?.hero,
          });
          updateItemContainer(backpackId, data.data?.backpack);
          setGameMessage({
            success: true,
            type: 'INFO',
            text: data.message,
            data: [{ name: data.data?.equipItemName ?? '' }],
          });
          break;

        case 'POTION': {
          updateItemContainer(backpackId, data.data?.backpack);
          updateHero({
            ...data.data?.hero,
          });
          const name = template.potionInfo?.buffTemplateId ? buffTemplateMapIds[template.potionInfo.buffTemplateId].name : template.name;
          if (template.potionInfo?.type === 'BUFF') {
            queryClient.invalidateQueries({
              queryKey: getBuffOptions(heroId).queryKey,
            });
          }
          setGameMessage({
            success: true,
            type: 'INFO',
            text: data.message,
            data: [{ name }],
          });
          break;
        }
        case 'SKILL_BOOK': {
          updateItemContainer(backpackId, data.data?.backpack);

          if (template.bookInfo?.kind === 'TRAIN_BUFF') {
            queryClient.invalidateQueries({
              queryKey: getBuffOptions(heroId).queryKey,
            });
          }
          const name = template.bookInfo?.buffTemplateId ? buffTemplateMapIds[template.bookInfo.buffTemplateId].name : template.name;

          setGameMessage({
            success: true,
            type: 'INFO',
            text: data.message,
            data: [{ name }],
          });

          break;
        }
      }
    },
  });
};

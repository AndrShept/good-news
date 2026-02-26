import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { itemEquip } from '../api/item-equip';
import { useEquipmentsUpdate } from './useEquipmentsUpdate';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useItemEquipMutation = () => {
  const setGameMessage = useSetGameMessage();
  const heroId = useHeroId();
  const { removeEquip, addEquip } = useEquipmentsUpdate();
  const { addItemInstance, removeItemInstance } = useItemContainerUpdate();
  const { updateHero } = useHeroUpdate();

  return useMutation({
    mutationFn: ({ itemInstanceId }: { itemInstanceId: string; itemTemplateId: string }) => itemEquip({ heroId, itemInstanceId }),

    async onSuccess(data, { itemTemplateId }) {
      updateHero({ ...data.data?.hero });
      if (data.data?.itemsDelta) {
        for (const i of data.data.itemsDelta) {
          if (i.itemContainerId) {
            switch (i.type) {
              case 'DELETE':
                removeItemInstance(i.itemContainerId, i.itemInstanceId);
                setGameMessage({ type: 'INFO', text: data.message, data: [{ name: i.itemName }] });

                break;
              case 'CREATE':
                addItemInstance(i.itemContainerId, i.item);
                break;
            }
          } else {
            switch (i.type) {
              case 'DELETE':
                removeEquip(i.itemInstanceId);
                break;
              case 'CREATE':
                addEquip(i.item);
            }
          }
        }
      }
    },
  });
};

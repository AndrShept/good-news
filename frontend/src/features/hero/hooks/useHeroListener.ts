import { useSocket } from '@/components/providers/SocketProvider';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { useSkillUpdate } from '@/features/skill/hooks/useSkillUpdate';
import { SelfHeroEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useBuff } from './useBuff';
import { useEquipmentsUpdate } from './useEquipmentsUpdate';
import { useGameData } from './useGameData';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useHeroListener = () => {
  const { socket } = useSocket();
  const { removeBuff } = useBuff();
  const { updateHero } = useHeroUpdate();
  const { updateSkill } = useSkillUpdate();
  const { addItemInstance, updateItemInstance } = useItemContainerUpdate();
  const { updateEquip, removeEquip } = useEquipmentsUpdate();
  const backpackId = useGetBackpackId();
  const heroId = useHeroId();
  const setGameMessage = useSetGameMessage();
  useEffect(() => {
    const listener = async (data: SelfHeroEvent) => {
      switch (data.type) {
        case 'REMOVE_BUFF':
          updateHero({ ...data.payload.hero });
          removeBuff(data.payload.buffInstanceId);
          break;
        case 'SKILL_UP':
          updateSkill(data.payload.skill.id, data.payload.skill);
          setGameMessage({ type: 'SKILL_EXP', text: data.payload.message, expAmount: data.payload.expAmount });
          break;
        case 'UPDATE_STATE':
          updateHero({ state: data.payload.state });
          break;

        case 'FINISH_GATHERING':
          updateHero({ gatheringFinishAt: null });
          setGameMessage({
            type: data.payload.itemName ? 'SUCCESS' : 'ERROR',
            text: data.payload.message,
            data: data.payload.itemName ? [{ name: data.payload.itemName, quantity: data.payload.quantity }] : undefined,
          });
          console.log(data.payload);
          if (data.payload.inventoryDeltas && data.payload.itemName) {
            for (const i of data.payload.inventoryDeltas) {
              switch (i.type) {
                case 'CREATE':
                  addItemInstance(i.itemContainerId ?? '', i.item);
                  break;
                case 'UPDATE':
                  updateItemInstance(i.itemContainerId ?? '', i.itemInstanceId, i.updateData);
                  break;
              }
            }
          }
          if (data.payload.equipmentDeltas) {
            for (const e of data.payload.equipmentDeltas) {
              switch (e.type) {
                case 'UPDATE':
                  updateEquip(e.itemInstanceId, { ...e.updateData });
                  break;
                case 'DELETE':
                  removeEquip(e.itemInstanceId);
                  setGameMessage({
                    type: 'ERROR',
                    text: `Your ${e.itemName}  has broken! `,
                  });
                  break;
              }
            }
          }

          break;
      }
    };

    socket.on(socketEvents.selfData(), listener);

    return () => {
      socket.off(socketEvents.selfData(), listener);
    };
  }, [heroId, removeBuff, setGameMessage, socket, updateHero, updateSkill]);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { getSkillsOptions } from '@/features/skill/api/get-skills';
import { QueueCraftItemSocketData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useQueueCraftItem } from './useQueueCraftItem';

export const useQueueCraftListener = () => {
  const { socket } = useSocket();
  const heroId = useHeroId();
  const queryClient = useQueryClient();
  const backpackId = useGetBackpackId();
  const { updateQueueCraftItems, removeQueueCraftItems } = useQueueCraftItem();
  const setGameMessage = useSetGameMessage();
  useEffect(() => {
    const listener = async (data: QueueCraftItemSocketData) => {
      switch (data.type) {
        case 'QUEUE_CRAFT_ITEM_COMPLETE':
          removeQueueCraftItems(data.payload.queueItemCraftId, data.payload.buildingType);

          await queryClient.invalidateQueries({
            queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
          });
          await queryClient.invalidateQueries({
            queryKey: getSkillsOptions(heroId).queryKey,
          });
          setGameMessage({ type: 'SUCCESS', text: 'You create new item', data: { gameItemName: data.payload.gameItemName } });
          if (data.payload.craftExpMessage) {
            setGameMessage({
              type: 'SKILL_EXP',
              text: data.payload.isLuckyCraft ? `${data.payload.craftExpMessage} 🔥` : data.payload.craftExpMessage,
            });
          }

          break;
        case 'QUEUE_CRAFT_ITEM_STATUS_UPDATE':
          updateQueueCraftItems(data.payload.queueItemCraftId, data.payload.buildingType, {
            status: data.payload.status,
            completedAt: data.payload.completedAt,
          });
          break;
      }
    };
    socket.on(socketEvents.queueCraft(), listener);

    return () => {
      socket.off(socketEvents.queueCraft(), listener);
    };
  }, [socket]);
};

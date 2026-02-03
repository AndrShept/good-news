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
    const listener = (data: QueueCraftItemSocketData) => {
      switch (data.type) {
        case 'COMPLETE':
          removeQueueCraftItems(data.payload.queueItemCraftId);

          queryClient.invalidateQueries({
            queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
          });
          queryClient.invalidateQueries({
            queryKey: getSkillsOptions(heroId).queryKey,
          });
          setGameMessage({ type: 'SUCCESS', text: data.payload.message, data: [{ name: data.payload.itemName }] });
          // if (data.payload.craftExpMessage) {
          //   setGameMessage({
          //     type: 'SKILL_EXP',
          //     text: data.payload.isLuckyCraft ? `${data.payload.craftExpMessage} 🔥` : data.payload.craftExpMessage,
          //   });
          // }

          break;
        case 'UPDATE':
          updateQueueCraftItems(data.payload.queueItemCraftId, {
            status: data.payload.status,
            expiresAt: data.payload.expiresAt,
          });
          break;

        case 'FAILED':
          removeQueueCraftItems(data.payload.queueItemCraftId);

          setGameMessage({ type: 'ERROR', text: data.payload.message });
      }
    };
    socket.on(socketEvents.queueCraft(), listener);

    return () => {
      socket.off(socketEvents.queueCraft(), listener);
    };
  }, [socket]);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
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
      console.error('FRONT', data);
      switch (data.type) {
        case 'QUEUE_CRAFT_ITEM_COMPLETE':
          removeQueueCraftItems(data.payload.queueItemCraftId);

          await queryClient.invalidateQueries({
            queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
          });
          setGameMessage({ type: 'SUCCESS', text: 'You create new item', data: { gameItemName: data.payload.gameItemName } });

          break;
        case 'QUEUE_CRAFT_ITEM_STATUS_UPDATE':
          updateQueueCraftItems(data.payload.queueItemCraftId, {
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

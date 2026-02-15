import { useSocket } from '@/components/providers/SocketProvider';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { QueueCraftItemSocketData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useQueueCraftItem } from './useQueueCraftItem';

export const useQueueCraftListener = () => {
  const { socket } = useSocket();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  const { updateItemContainer } = useItemContainerUpdate();
  const { updateQueueCraftItems, removeQueueCraftItems } = useQueueCraftItem();
  const setGameMessage = useSetGameMessage();
  useEffect(() => {
    const listener = (data: QueueCraftItemSocketData) => {
      switch (data.type) {
        case 'COMPLETE':
          removeQueueCraftItems(data.payload.queueItemCraftId);
          updateItemContainer(backpackId, data.payload.backpack);
          setGameMessage({
            type: data.payload.successCraft ? 'SUCCESS' : 'ERROR',
            text: data.payload.message,
            data: [{ name: data.payload.itemName }],
          });

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
  }, [backpackId, heroId, removeQueueCraftItems, setGameMessage, socket, updateItemContainer, updateQueueCraftItems]);
};

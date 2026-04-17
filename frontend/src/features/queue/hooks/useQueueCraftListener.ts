import { useSocket } from '@/components/providers/SocketProvider';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { QueueCraftItemSocketEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useQueueCraftItem } from './useQueueCraftItem';

export const useQueueCraftListener = () => {
  const { socket } = useSocket();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  const { addItemInstance, removeItemInstance, updateItemInstance, updateItemByDeltaEvents } = useItemContainerUpdate();
  const { updateQueueCraftItems, removeQueueCraftItems } = useQueueCraftItem();
  const setGameMessage = useSetGameMessage();
  useEffect(() => {
    const listener = (data: QueueCraftItemSocketEvent) => {
      switch (data.type) {
        case 'COMPLETE':
          removeQueueCraftItems(data.payload.queueItemCraftId);

          if (data.payload.itemsDelta) {
            updateItemByDeltaEvents(data.payload.itemsDelta);
          }

          setGameMessage({
            color: data.payload.successCraft ? 'GREEN' : 'RED',
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
          setGameMessage({ color: 'RED', text: data.payload.message });
      }
    };
    socket.on(socketEvents.queueCraft(), listener);

    return () => {
      socket.off(socketEvents.queueCraft(), listener);
    };
  }, [
    addItemInstance,
    backpackId,
    heroId,
    removeItemInstance,
    removeQueueCraftItems,
    setGameMessage,
    socket,
    updateItemByDeltaEvents,
    updateItemInstance,
    updateQueueCraftItems,
  ]);
};

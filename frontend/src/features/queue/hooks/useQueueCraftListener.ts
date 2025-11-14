import { useSocket } from '@/components/providers/SocketProvider';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { QueueCraftItemSocketData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useQueueCraftItem } from './useQueueCraftItem';

export const useQueueCraftListener = () => {
  const { socket } = useSocket();
  const heroId = useHeroId();
  const queryClient = useQueryClient();
  const backpackId = useGetBackpackId();
  const { updateQueueCraftItems, removeQueueCraftItems } = useQueueCraftItem();
  useEffect(() => {
    const listener = async (data: QueueCraftItemSocketData) => {
      switch (data.type) {
        case 'QUEUE_CRAFT_ITEM_COMPLETE':
          removeQueueCraftItems(data.payload.queueItemCraftId);
          await queryClient.invalidateQueries({
            queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
          });

          break;
        case 'QUEUE_CRAFT_ITEM_STATUS_UPDATE':
          updateQueueCraftItems(data.payload.queueItemCraftId, { status: data.payload.status });
          break;
      }
    };
    socket.on(socketEvents.queueCraft(), listener);

    return () => {
      socket.off(socketEvents.queueCraft(), listener);
    };
  }, []);
};

import { useSocket } from '@/components/providers/SocketProvider';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { getInventoryOptions } from '@/features/hero/api/get-inventory';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { QueueCraftItemSocketData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useQueueCraftListener = () => {
  const { socket } = useSocket();
  const id = useHeroId();
  const queryClient = useQueryClient();
  const { updateCraftItemsQueue } = useHeroUpdate();
  useEffect(() => {
    const listener = async (data: QueueCraftItemSocketData) => {
      switch (data.type) {
        case 'QUEUE_CRAFT_ITEM_COMPLETE':
          await queryClient.invalidateQueries({ queryKey: getInventoryOptions(id).queryKey });
          await queryClient.invalidateQueries({
            queryKey: getHeroOptions().queryKey,
          });
          break;
        case 'QUEUE_CRAFT_ITEM_STATUS_UPDATE':
          console.log(data);
          updateCraftItemsQueue(data.payload.queueItemCraftId, { status: data.payload.status });
          break;
      }
    };
    socket.on(socketEvents.queueCraft(), listener);

    return () => {
      socket.off(socketEvents.queueCraft(), listener);
    };
  }, []);
};

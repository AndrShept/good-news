import type { QueueCraftItemSocketData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { recipeTemplateById } from '@/shared/templates/recipe-template';

import { io } from '..';
import { itemContainerService } from '../services/item-container-service';
import { itemTemplateService } from '../services/item-template-service';
import { queueCraftService } from '../services/queue-craft-service';
import { serverState } from './state/server-state';

export const queueCraftTick = (now: number) => {
  for (const [heroId, queueCraftItems] of serverState.queueCraft.entries()) {
    const first = queueCraftItems.at(0);
    if (!first) continue;
    if (first.expiresAt <= now) {
      const queue = queueCraftItems.shift();
      if (!queue) continue;
      const backpack = itemContainerService.getBackpack(heroId);
      const recipe = recipeTemplateById[queue.recipeId];
      const next = queueCraftItems.at(0);
      const template = itemTemplateService.getAllItemsTemplateMapIds()[recipe.itemTemplateId];
      const result = { message: '', success: true };
      try {
        queueCraftService.canStartCraft(heroId, queue.coreResourceId, queue.recipeId);
      } catch (err) {
        const error = err as Error;
        result.message = error.message;
        result.success = false;
      }
      let nextQueueData: QueueCraftItemSocketData | undefined;
      if (next) {
        nextQueueData = {
          type: 'UPDATE',
          payload: {
            status: 'PROGRESS',
            queueItemCraftId: next.id,
            expiresAt: now + recipe.timeMs,
          },
        };
      }
      if (!result.success) {
        const socketData: QueueCraftItemSocketData = {
          type: 'FAILED',
          payload: {
            message: result.message,
            queueItemCraftId: queue.id,
          },
        };
        io.to(heroId).emit(socketEvents.queueCraft(), socketData);
        if (nextQueueData) {
          queueCraftService.updateStatus(heroId, nextQueueData.payload.queueItemCraftId, 'PROGRESS');
          io.to(heroId).emit(socketEvents.queueCraft(), nextQueueData);
        }
        return;
      }

      itemContainerService.createItem({ itemContainerId: backpack.id, heroId, quantity: 1, itemTemplateId: template.id });

      queueCraftService.consumeAllItemsForCraft(queue.coreResourceId, backpack, recipe);
      const socketData: QueueCraftItemSocketData = {
        type: 'COMPLETE',
        payload: {
          message: 'Success complete craft item',
          itemName: template.name,
          queueItemCraftId: queue.id,
          isLuckyCraft: false,
        },
      };
      io.to(heroId).emit(socketEvents.queueCraft(), socketData);
      if (nextQueueData) {
        queueCraftService.updateStatus(heroId, nextQueueData.payload.queueItemCraftId, 'PROGRESS');
        io.to(heroId).emit(socketEvents.queueCraft(), nextQueueData);
      }
    }
  }
};

import { recipeTemplateById } from '@/shared/templates/recipe-template';

import { itemContainerService } from '../services/item-container-service';
import { itemTemplateService } from '../services/item-template-service';
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
      const template = itemTemplateService.getAllItemsTemplateMapIds()[recipe.itemTemplateId];
      itemContainerService.buyItem({ itemContainerId: backpack.id, heroId, quantity: 1, itemTemplateId: template.id });
      for (const regResource of recipe.requirement.resources) {
        for (const item of backpack.itemsInstance) {
          if (regResource.templateId === item.itemTemplateId) {
            itemContainerService.consumeItem({
              quantity: regResource.amount,
              itemInstanceId: item.id,
              itemContainerId: backpack.id,
            });
          }
        }
      }
    }
  }
};

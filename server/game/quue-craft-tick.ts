import type { QueueCraftItemSocketData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { recipeTemplateById } from '@/shared/templates/recipe-template';
import { type SkillKey, skillTemplateById, skillTemplateByKey } from '@/shared/templates/skill-template';

import { io } from '..';
import { getDisplayName, rollChance } from '../lib/utils';
import { heroService } from '../services/hero-service';
import { itemContainerService } from '../services/item-container-service';
import { itemTemplateService } from '../services/item-template-service';
import { progressionService } from '../services/progression-service';
import { queueCraftService } from '../services/queue-craft-service';
import { skillService } from '../services/skill-service';
import { socketService } from '../services/socket-service';
import { serverState } from './state/server-state';

export const queueCraftTick = (now: number) => {
  for (const [heroId, queueCraftItems] of serverState.queueCraft.entries()) {
    const first = queueCraftItems.at(0);
    if (!first) continue;
    if (first.expiresAt <= now) {
      const queue = queueCraftItems.shift();
      if (!queue) continue;
      const backpack = itemContainerService.getBackpack(heroId);
      const hero = heroService.getHero(heroId);
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

      if (!result.success) {
        const socketData: QueueCraftItemSocketData = {
          type: 'FAILED',
          payload: {
            message: result.message,
            queueItemCraftId: queue.id,
          },
        };
        io.to(heroId).emit(socketEvents.queueCraft(), socketData);
        if (next) {
          queueCraftService.setNextQueue(heroId, next.id, recipeTemplateById[next.recipeId].timeMs);
        }
        if (!queueCraftItems.length) {
          socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, 'IDLE');
          hero.state = 'IDLE';
        }
        return;
      }

      const skillInstance = skillService.getSkillBySkillTemplateId(heroId, recipe.requirement.skills[0].skillTemplateId);
      const skillKey = skillTemplateById[skillInstance.skillTemplateId].key as SkillKey;
      const loreSkillKey = skillService.getLoreSkillKey(recipe, queue.coreResourceId);
      const loreSkillInstance = skillService.getSkillByKey(heroId, loreSkillKey);
      const chance = queueCraftService.getCraftChance({
        coreResourceId: queue.coreResourceId,
        recipeMin: recipe.requirement.skills[0].level,
        craftSkillLevel: skillInstance.level,
        loreSkillLevel: loreSkillInstance.level,
      });
      const successCraft = rollChance(chance);
      const finalExp = progressionService.calculateCraftExp({
        chance,
        recipe,
        success: successCraft,
        coreResourceId: queue.coreResourceId,
      });
      const finalExpLoreSkill = progressionService.calculateLoreExp({
        chance,
        coreResourceId: queue.coreResourceId,
        recipe,
        success: successCraft,
      });
      const expResult = skillService.addExp(heroId, skillKey, finalExp);
      const expResultLoreSkill = skillService.addExp(heroId, loreSkillKey, finalExpLoreSkill);

      const displayName = getDisplayName(recipe.itemTemplateId, queue.coreResourceId);
      if (successCraft) {
        itemContainerService.createItem({
          itemContainerId: backpack.id,
          heroId,
          quantity: 1,
          itemTemplateId: template.id,
          coreResourceId: queue.coreResourceId,
        });
        result.message = 'Success complete craft item';
      } else {
        result.message = 'Crafting failed! The materials were lost in the process';
      }

      queueCraftService.consumeAllItemsForCraft(queue.coreResourceId, backpack, recipe);
      const socketData: QueueCraftItemSocketData = {
        type: 'COMPLETE',
        payload: {
          message: result.message,
          itemName: displayName ?? template.name,
          successCraft,
          queueItemCraftId: queue.id,
          backpack,
        },
      };
      socketService.sendToClientExpResult({ expResult, heroId });
      socketService.sendToClientExpResult({ expResult: expResultLoreSkill, heroId });
      io.to(heroId).emit(socketEvents.queueCraft(), socketData);
      if (next) {
        queueCraftService.setNextQueue(heroId, next.id, recipeTemplateById[next.recipeId].timeMs);
      }
      if (!queueCraftItems.length) {
        socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, 'IDLE');
        hero.state = 'IDLE';
      }
    }
  }
};

import { socketEvents } from '@/shared/socket-events';
import { placeTemplate } from '@/shared/templates/place-template';
import { recipeTemplateById } from '@/shared/templates/recipe-template';
import { resourceTemplateById } from '@/shared/templates/resource-template';
import type { SkillKey } from '@/shared/templates/skill-template';
import type { CoreResourceType, QueueCraftStatusType, RecipeTemplate, ResourceCategoryType, TItemContainer } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { serverState } from '../game/state/server-state';
import { CORE_RESOURCE_TABLE } from '../lib/table/crafting-table';
import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { itemTemplateService } from './item-template-service';
import { skillService } from './skill-service';
import { clamp } from '../lib/utils';

interface GetCraftChance {
  craftSkillLevel: number;
  loreSkillLevel: number;
  coreResourceId: string | undefined;
  recipeMin: number;
}

export const queueCraftService = {
  getQueueCraft(heroId: string) {
    const queueCraft = serverState.queueCraft.get(heroId);
    if (!queueCraft) {
      throw new HTTPException(400, {
        message: 'queue craft not found',
      });
    }
    return queueCraft;
  },

  canStartCraft(heroId: string, coreResourceId: string | undefined, recipeId: string) {
    const hero = heroService.getHero(heroId);
    const recipe = recipeTemplateById[recipeId];
    const place = placeTemplate.find((p) => p.id === hero.location.placeId);

    heroService.checkFreeBackpackCapacity(hero.id);

    const validateRequiredBuilding = place?.buildings?.some((b) => b.type === recipe.requirement.building);

    if (!validateRequiredBuilding) {
      throw new HTTPException(400, {
        message: 'You are not inside the required place building.',
        cause: { canShow: true },
      });
    }

    if (recipe.requirement.isCore && !coreResourceId) {
      throw new HTTPException(400, {
        message: 'You need select core resource for this craft item.',
        cause: { canShow: true },
      });
    }
    const copyReqResources = recipe.requirement.resources.map((res) => ({ ...res }));
    if (coreResourceId && recipe.requirement.isCore) {
      const coreResourceTemplate = itemTemplateService.getAllItemsTemplateMapIds()[coreResourceId];
      const firstRes = copyReqResources.at(0);
      if (firstRes) {
        firstRes.templateId = coreResourceId;
      }
      if (recipe.requirement.category !== coreResourceTemplate.resourceInfo?.category) {
        throw new HTTPException(400, {
          message: 'Invalid base resource for this craft item.',
          cause: { canShow: true },
        });
      }
    }

    for (const reqSkill of recipe.requirement.skills) {
      skillService.checkSkillRequirement(hero.id, reqSkill.skillTemplateId, reqSkill.level);
    }
    for (const reqResource of copyReqResources) {
      itemContainerService.checkRequirementsItems(hero.id, reqResource.templateId, reqResource.amount);
    }
  },

  consumeAllItemsForCraft(coreResourceId: string | undefined, backpack: TItemContainer, recipe: RecipeTemplate) {
    const copyReqResources = recipe.requirement.resources.map((res) => ({ ...res }));
    if (coreResourceId && recipe.requirement.isCore) {
      const firstRes = copyReqResources.at(0);
      if (firstRes) {
        firstRes.templateId = coreResourceId;
      }
    }
    for (const regResource of copyReqResources) {
      const item = backpack.itemsInstance.find((i) => i.itemTemplateId === regResource.templateId);

      if (!item) {
        throw new Error('Not enough items');
      }

      itemContainerService.consumeItem({
        quantity: regResource.amount,
        itemInstanceId: item.id,
        itemContainerId: backpack.id,
        mode: 'all',
      });
    }
  },
  updateStatus(heroId: string, queueCraftId: string, status: QueueCraftStatusType) {
    const queuesCrafts = serverState.queueCraft.get(heroId);
    if (!queuesCrafts) return;
    const queue = queuesCrafts.find((q) => q.id === queueCraftId);
    if (!queue) return;
    queue.status = status;
  },
  setNextQueue(heroId: string, nextQueueId: string, timeMs: number) {
    const now = Date.now();
    const nextQueueData = {
      type: 'UPDATE',
      payload: {
        status: 'PROGRESS',
        queueItemCraftId: nextQueueId,
        expiresAt: now + timeMs,
      },
    };

    this.updateStatus(heroId, nextQueueId, 'PROGRESS');
    io.to(heroId).emit(socketEvents.queueCraft(), nextQueueData);
  },
  getCraftChance({ coreResourceId, recipeMin, craftSkillLevel, loreSkillLevel }: GetCraftChance): number {
    const baseChance = 40; // стартовий шанс
    const gainPerLevel = 3; // % за рівень вище мінімуму
    const loreScale = 0.25; // наскільки lore впливає

    let resourceMin = 0;

    if (coreResourceId) {
      const template = itemTemplateService.getAllItemsTemplateMapIds()[coreResourceId];
      resourceMin = CORE_RESOURCE_TABLE[template.key as CoreResourceType]?.requiredMinSkill ?? 0;
    }

    // Складність = що складніше: рецепт чи ресурс
    const effectiveMin = Math.max(recipeMin, resourceMin);

    const diff = craftSkillLevel - effectiveMin;

    if (diff < 0) return 0; // не дозволяємо крафт нижче мін

    const loreBonus = loreSkillLevel * loreScale;

    const chance = baseChance + diff * gainPerLevel + loreBonus;

    return clamp(chance, 5, 97); // ніколи не 100%
  },
};

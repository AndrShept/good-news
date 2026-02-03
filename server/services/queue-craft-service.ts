import { placeTemplate } from '@/shared/templates/place-template';
import { recipeTemplateById } from '@/shared/templates/recipe-template';
import type { QueueCraftStatusType, RecipeTemplate, TItemContainer } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { itemTemplateService } from './item-template-service';
import { skillService } from './skill-service';

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

    if (recipe.requirement.coreResource && !coreResourceId) {
      throw new HTTPException(400, {
        message: 'You need select core resource for this craft item.',
        cause: { canShow: true },
      });
    }
    const copyReqResources = recipe.requirement.resources.map((res) => ({ ...res }));
    if (coreResourceId && recipe.requirement.coreResource) {
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
      skillService.checkSkillRequirement(hero.id, reqSkill.skillId, reqSkill.level);
    }
    for (const reqResource of copyReqResources) {
      itemContainerService.checkRequirementsItems(hero.id, reqResource.templateId, reqResource.amount);
    }
  },

  consumeAllItemsForCraft(coreResourceId: string | undefined, backpack: TItemContainer, recipe: RecipeTemplate) {
    const copyReqResources = recipe.requirement.resources.map((res) => ({ ...res }));
    if (coreResourceId) {
      const firstRes = copyReqResources.at(0);
      if (firstRes) {
        firstRes.templateId = coreResourceId;
      }
    }
    for (const regResource of copyReqResources) {
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
  },
  updateStatus(heroId: string, queueCraftId: string, status: QueueCraftStatusType) {
    const queuesCrafts = serverState.queueCraft.get(heroId);
    if (!queuesCrafts) return;
    const queue = queuesCrafts.find((q) => q.id === queueCraftId);
    if (!queue) return;
    queue.status = status;
  },
};

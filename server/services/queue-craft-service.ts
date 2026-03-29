import { MAX_SKILL } from '@/shared/constants';
import { socketEvents } from '@/shared/socket-events';
import { placeTemplate } from '@/shared/templates/place-template';
import { recipeTemplateById } from '@/shared/templates/recipe-template';
import { resourceTemplateById } from '@/shared/templates/resource-template';
import type { SkillKey } from '@/shared/templates/skill-template';
import type {
  ColoredResourceCategoryType,
  CoreResourceType,
  OmitModifier,
  QueueCraftStatusType,
  RecipeTemplate,
  ResourceCategoryType,
  TItemContainer,
} from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { serverState } from '../game/state/server-state';
import { resourceMetaConfig } from '../lib/config/resource-config';
import { clamp } from '../lib/utils';
import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { itemTemplateService } from './item-template-service';
import { skillService } from './skill-service';

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

    const validateRequiredBuilding = place?.buildings?.some((b) => b.key === recipe.requirement.buildingCraftLocation);

    if (!validateRequiredBuilding) {
      throw new HTTPException(400, {
        message: 'You are not inside the required place building.',
        cause: { canShow: true },
      });
    }
    const coreMaterial = recipe.requirement.materials.find((m) => m.role === 'CORE');
    if (coreMaterial && !coreResourceId) {
      throw new HTTPException(400, {
        message: 'You need select core resource for this craft item.',
        cause: { canShow: true },
      });
    }
    if (coreResourceId && coreMaterial) {
      const coreResourceTemplate = itemTemplateService.getAllItemsTemplateMapIds()[coreResourceId];

      if (!coreMaterial.categories?.includes(coreResourceTemplate.resourceInfo!.category as ColoredResourceCategoryType)) {
        throw new HTTPException(400, {
          message: 'Invalid base resource for this craft item.',
          cause: { canShow: true },
        });
      }
    }

    const reqCraftMaterials = recipe.requirement.materials.map((m) => {
      if (coreResourceId && m.role === 'CORE') {
        return { ...m, templateId: coreResourceId };
      }
      return m;
    });

    for (const reqSkill of recipe.requirement.skills) {
      skillService.checkSkillRequirement(hero.id, reqSkill.skillTemplateId, reqSkill.level);
    }
    for (const reqMaterial of reqCraftMaterials) {
      if (!reqMaterial.templateId) continue;
      itemContainerService.checkRequirementsItems(hero.id, reqMaterial.templateId, reqMaterial.amount);
    }
  },

  consumeAllItemsForCraft(coreResourceId: string | undefined, backpack: TItemContainer, recipe: RecipeTemplate) {
    const reqCraftMaterials = recipe.requirement.materials.map((m) => {
      if (coreResourceId && m.role === 'CORE') {
        return { ...m, templateId: coreResourceId };
      }
      return m;
    });

    const resultDelta = [];
    for (const reqMaterial of reqCraftMaterials) {
      const item = backpack.itemsInstance.find((i) => i.itemTemplateId === reqMaterial.templateId);

      if (!item) {
        throw new Error('Not enough items');
      }
      const itemsDelta = itemContainerService.consumeItem({
        quantity: reqMaterial.amount,
        itemInstanceId: item.id,
        itemContainerId: backpack.id,
        mode: 'all',
      });
      resultDelta.push(...itemsDelta);
    }
    return resultDelta;
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
      resourceMin = resourceMetaConfig[template.key as CoreResourceType]?.requiredMinSkill ?? 0;
    }

    // Складність = що складніше: рецепт чи ресурс
    const effectiveMin = Math.max(recipeMin, resourceMin);

    const diff = craftSkillLevel - effectiveMin;

    const loreBonus = loreSkillLevel * loreScale;

    const chance = baseChance + diff * gainPerLevel + loreBonus;
    console.log('CRAFT-CHANGE', chance);
    return clamp(chance, 3, 99); // ніколи не 100%
  },
  calculateFinalCraftModifiers(heroId: string, coreResourceId: string, modifier: Partial<OmitModifier>) {
    const loreSkillKey = skillService.getLoreSkillByItemTemplateId(coreResourceId);
    const loreSkillInstance = skillService.getSkillByKey(heroId, loreSkillKey);

    const skillFactor = loreSkillInstance.level / MAX_SKILL;

    const modifierWithLoreSkill = Object.entries(modifier).reduce((acc, [key, value]) => {
      acc[key as keyof OmitModifier] = Math.floor(value * (0.5 + 0.5 * skillFactor));

      return acc;
    }, {} as OmitModifier);

    return modifierWithLoreSkill;
  },
  calculateFinalCraftDurability(durability: number, coreResourceId: string) {
    const coreResource = resourceTemplateById[coreResourceId];

    const resourceConfig = resourceMetaConfig[coreResource.key as CoreResourceType];
    return resourceConfig.durabilityMultiplier * durability;
  },
};

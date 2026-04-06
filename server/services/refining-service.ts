import { recipeTemplateById } from '@/shared/templates/recipe-template';
import { resourceTemplateById, resourceTemplateByKey } from '@/shared/templates/resource-template';
import type { ItemInstance, RefineOperation, RefiningBuildingKey, RefiningRecipe } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { refiningRecipeByInput } from '../lib/table/refining-table';
import { clamp } from '../lib/utils';
import { itemTemplateService } from './item-template-service';
import { skillService } from './skill-service';

interface GetRefineChance {
  input: string;
  refineSkillLevel: number;
  loreSkillLevel: number;
}

interface CalculateRefineTime {
  baseTimeMs: number;
  refineSkillLevel: number;
  requiredMinSkill: number;
}

interface GetRefineOutputQuantity {
  recipe: RefiningRecipe;
  refineSkillLevel: number;
  loreSkillLevel: number;
}

export const refiningService = {
  getQueueRefine(heroId: string) {
    const queueRefine = serverState.queueRefine.get(heroId);
    if (!queueRefine) throw new HTTPException(400, { message: 'queueRefine not found' });
    return queueRefine;
  },
  createQueue(heroId: string, refineBuildingKey: RefiningBuildingKey, itemInstances: ItemInstance[]) {
    const refiningData: RefineOperation[] = [];
    const refineSkillKey = skillService.getRefiningSkillByBuilding(refineBuildingKey);
    const refineSkillInstance = skillService.getSkillByKey(heroId, refineSkillKey);

    for (const itemInstance of itemInstances) {
      const itemTemplate = itemInstance.coreResource
        ? itemTemplateService.getAllItemsTemplateMapIds()[itemInstance.itemTemplateId]
        : resourceTemplateById[itemInstance.itemTemplateId];

      if (!itemTemplate) continue;
      switch (itemTemplate.type) {
        case 'RESOURCES': {
          const recipe = refiningRecipeByInput[itemTemplate.key];
          const loreSkillKey = skillService.getLoreSkillByItemTemplateId(itemTemplate.id);

          const loreSkillInstance = skillService.getSkillByKey(heroId, loreSkillKey);
          const iterationCount = Math.floor(itemInstance.quantity / recipe.inputQuantity);

          for (let i = 0; i < iterationCount; i++) {
            refiningData.push({
              input: {
                itemInstanceId: itemInstance.id,
                itemTemplateId: itemTemplate.id,
                name: itemTemplate.name,
                quantity: recipe.inputQuantity,
              },
              output: {
                itemTemplateId: resourceTemplateByKey[recipe.output].id,
                name: resourceTemplateByKey[recipe.output].name,
                quantity: recipe.outputQuantity,
              },
              finishAt: refiningService.calculateRefineTime({
                baseTimeMs: Date.now() + 10_000 * (i + 1),
                requiredMinSkill: recipe.requiredMinSkill,
                refineSkillLevel: refineSkillInstance.level,
              }),
              loreSKillInstanceId: loreSkillInstance.id,
              refineSkillInstanceId: refineSkillInstance.id,
              itemContainerId: itemInstance.itemContainerId!,
              recipe,
              refineChance: this.getRefineChance({
                input: recipe.input,
                refineSkillLevel: refineSkillInstance.level,
                loreSkillLevel: loreSkillInstance.level,
              }),
            });
          }
          break;
        }

        case 'TOOL':
        case 'SHIELD':
        case 'ARMOR':
        case 'WEAPON':
          if (!itemInstance.coreResource) return;
          const coreResourceRecipe = refiningRecipeByInput[itemInstance.coreResource];
          const coreResourceTemplate = resourceTemplateByKey[itemInstance.coreResource];
          const craftItemRecipe = recipeTemplateById[itemTemplate.id];
          const loreSKillKey = skillService.getLoreSkillByItemTemplateId(coreResourceTemplate.id);
          const loreSkillInstance = skillService.getSkillByKey(heroId, loreSKillKey);
          const reqCoreMaterial = craftItemRecipe.requirement.materials.find((m) => m.role === 'CORE');
          if (!reqCoreMaterial) return;
          refiningData.push({
            loreSKillInstanceId: loreSkillInstance.id,
            refineSkillInstanceId: refineSkillInstance.id,
            itemContainerId: itemInstance.itemContainerId!,
            input: {
              itemInstanceId: itemInstance.id,
              itemTemplateId: itemTemplate.id,
              name: itemInstance.displayName,
              quantity: 1,
            },
            output: {
              itemTemplateId: coreResourceTemplate.id,
              name: coreResourceTemplate.name,
              quantity: Math.floor(reqCoreMaterial.amount / 2),
            },
            recipe: coreResourceRecipe,
            refineChance: this.getRefineChance({
              input: coreResourceRecipe.input,
              refineSkillLevel: refineSkillInstance.level,
              loreSkillLevel: loreSkillInstance.level,
            }),
            finishAt:
              Date.now() +
              this.calculateRefineTime({
                refineSkillLevel: refineSkillInstance.level,
                requiredMinSkill: coreResourceRecipe.requiredMinSkill,
                baseTimeMs: craftItemRecipe.timeMs,
              }),
          });
          break;
      }
    }
    serverState.queueRefine.set(heroId, refiningData);
  },

  getRefineChance({ input, refineSkillLevel, loreSkillLevel }: GetRefineChance): number {
    const baseChance = 45;
    const gainPerLevel = 2;
    const loreScale = 0.15;

    const recipe = refiningRecipeByInput[input];
    if (!recipe) return 0;

    const diff = refineSkillLevel - recipe.requiredMinSkill;

    const loreBonus = loreSkillLevel * loreScale;

    const chance = baseChance + diff * gainPerLevel + loreBonus;

    return clamp(chance, 5, 99);
  },

  calculateRefineTime({ baseTimeMs, refineSkillLevel, requiredMinSkill }: CalculateRefineTime): number {
    const maxReduction = 0.5; // максимум 50% зменшення часу
    const reductionPerLevel = 0.004; // 0.4% за рівень вище мінімуму

    const levelDiff = refineSkillLevel - requiredMinSkill;
    const reduction = levelDiff > 0 ? clamp(levelDiff * reductionPerLevel, 0, maxReduction) : 0;

    return Math.max(1000, Math.floor(baseTimeMs * (1 - reduction)));
  },
  getRefineOutputQuantity({ refineSkillLevel, loreSkillLevel, recipe }: GetRefineOutputQuantity): number {
    // чим складніший матеріал тим менший шанс на бонус
    const complexityPenalty = 1 - recipe.requiredMinSkill * 0.005;
    // requiredMinSkill: 0   → penalty: 1.0   (без штрафу)
    // requiredMinSkill: 50  → penalty: 0.75
    // requiredMinSkill: 80  → penalty: 0.6
    // requiredMinSkill: 100 → penalty: 0.5
    let finalQuantity = recipe.outputQuantity;
    const chance = (refineSkillLevel * 0.001 + loreSkillLevel * 0.003) * clamp(complexityPenalty, 0.3, 1);

    const finalChance = clamp(chance, 0, 0.4);
    if (finalChance > Math.random()) {
      return finalQuantity + 1;
    }
    return finalQuantity;
  },
};

import { resourceTemplateById } from '@/shared/templates/resource-template';
import type { ItemInstance, RefineOperation, RefiningBuildingKey } from '@/shared/types';
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
      const loreSkillKey = skillService.getLoreSkillByItemTemplateId(itemTemplate.id);
      const loreSkillInstance = skillService.getSkillByKey(heroId, loreSkillKey);
      const recipe = refiningRecipeByInput[itemTemplate.key];
      switch (itemTemplate.type) {
        case 'RESOURCES':
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
                itemTemplateId: itemTemplate.id,
                name: itemTemplate.name,
                quantity: recipe.outputQuantity,
              },
              finishAt: 10_000 * (i + 1),
              loreSKillInstanceId: loreSkillInstance.id,
              refineSkillInstanceId: refineSkillInstance.id,
              itemContainerId: itemInstance.itemContainerId!,
              refineChance: this.getRefineChance({
                input: recipe.input,
                refineSkillLevel: refineSkillInstance.level,
                loreSkillLevel: loreSkillInstance.level,
              }),
            });
          }
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
  getRefineTimeMs() {},
};

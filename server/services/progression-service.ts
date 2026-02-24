import type { CoreResourceType, RecipeTemplate } from '@/shared/types';

import { CORE_RESOURCE_TABLE } from '../lib/table/crafting-table';
import { clamp } from '../lib/utils';
import { itemTemplateService } from './item-template-service';

interface CalculateCraftExp {
  recipe: RecipeTemplate;
  chance: number;
  success: boolean;
  coreResourceId: string | undefined;
}

interface CalculateLoreExp {
  success: boolean;
  loreSkillLevel: number | undefined;
  timeMs: number;
  requiredMinSkill: number;
}

interface CalculateGatherExp {
  requiredMinSkill: number;
  gatherSkillLevel: number;
  success: boolean;
}

export const progressionService = {
  calculateCraftExp({ chance, coreResourceId, recipe, success }: CalculateCraftExp): number {
    const recipeLevel = recipe.requirement.skills[0].level;
    let exp = recipeLevel * 6;

    if (coreResourceId) {
      const template = itemTemplateService.getAllItemsTemplateMapIds()[coreResourceId];
      const resourceRequired = CORE_RESOURCE_TABLE[template.key as CoreResourceType].requiredMinSkill;

      exp += resourceRequired * 4;
    }

    // ризик-бонус
    exp *= clamp(1.2 - chance / 100, 0.3, 1);

    if (!success) {
      exp *= 0.25;
    }

    return Math.max(1, Math.floor(exp));
  },

  calculateLoreExp({ timeMs, requiredMinSkill, loreSkillLevel, success }: CalculateLoreExp): number {
    // 1️⃣ База від складності
    const baseXp = 5 + requiredMinSkill * 1.5;

    // 2️⃣ Бонус за час
    const timeBonus = 0   // (timeMs / 1000) * 0.4;

    // 3️⃣ Якщо рівень сильно перевищує складність — менше EXP
    const levelDiff = (loreSkillLevel ?? 0) - requiredMinSkill;
    const overlevelPenalty = levelDiff > 0 ? clamp(1 - levelDiff * 0.03, 0.2, 1) : 1;

    let exp = (baseXp + timeBonus) * overlevelPenalty;

    // 4️⃣ Фейл дає менше
    if (!success) {
      exp *= 0.5;
    }

    return Math.max(1, Math.floor(exp));
  },

  calculateBookExp(skillLevel: number, durationMs: number): number {
    const hours = durationMs / (1000 * 60 * 60);

    const basePerHour = 300;

    const levelScaling = 1 / (1 + skillLevel * 0.05);

    const exp = basePerHour * hours * levelScaling;

    return Math.max(1, Math.floor(exp));
  },

  calculateGatherExp({ requiredMinSkill, gatherSkillLevel, success }: CalculateGatherExp) {
    // XP за спробу (для AFK стабільність)
    const attemptXp = 3 + gatherSkillLevel * 0.03;

    if (!success) {
      return Math.floor(attemptXp);
    }

    const baseXp = 10 + requiredMinSkill * 0.4;

    const levelDiff = gatherSkillLevel - requiredMinSkill;
    const penalty = levelDiff > 0 ? levelDiff * 0.015 : 0;

    const xpMultiplier = clamp(1 - penalty, 0.1, 1);

    const successXp = baseXp * xpMultiplier;

    return Math.floor(attemptXp + successXp);
  },
};

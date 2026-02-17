import type { RecipeTemplate } from '@/shared/types';

import { rarityConfig } from '../lib/config/rarity-config';
import { clamp } from '../lib/utils';
import { itemTemplateService } from './item-template-service';
import { skillService } from './skill-service';

interface CalculateCraftExp {
  recipe: RecipeTemplate;
  chance: number;
  success: boolean;
  coreResourceId: string | undefined;
}

interface CalculateLoreExp {
  recipe: RecipeTemplate;
  success: boolean;
  chance: number;
  coreResourceId: string | undefined;
}

export const progressionService = {
  calculateCraftExp({ chance, coreResourceId, recipe, success }: CalculateCraftExp): number {
    let exp = Math.floor(recipe.requirement.skills[0].level * 8 + (recipe.timeMs / 1000) * 0.5);

    exp *= clamp(1.2 - chance / 100, 0.3, 1);

    // rarity bonus
    if (coreResourceId) {
      const template = itemTemplateService.getAllItemsTemplateMapIds()[coreResourceId];

      const rarity = template?.rarity ?? 'COMMON';
      const rarityValue = rarityConfig[rarity].value;
      const rarityBonus = 1 + rarityValue * 0.15;

      exp *= rarityBonus;
    }

    if (!success) {
      exp *= 0.3;
    }

    return Math.max(1, Math.floor(exp));
  },

  calculateLoreExp({ chance, coreResourceId, recipe, success }: CalculateLoreExp): number {
    let exp = recipe.requirement.skills[0].level * 2 + (recipe.timeMs / 1000) * 0.2;

    exp *= clamp(1.1 - chance / 100, 0.4, 1);

    if (coreResourceId) {
      const template = itemTemplateService.getAllItemsTemplateMapIds()[coreResourceId];

      const rarity = template?.rarity ?? 'COMMON';
      const rarityValue = rarityConfig[rarity].value;
      const rarityBonus = 1 + rarityValue * 0.1;

      exp *= rarityBonus;
    }

    if (!success) {
      exp *= 0.7;
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
};

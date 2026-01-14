import type { RecipeTemplate } from '@/shared/types';

import { generateRandomUuid } from '../lib/utils';
import { resourceTemplateMap } from './resource-template';
import { skillTemplateMap } from './skill-template';

export const recipeTemplate = [
  {
    id: generateRandomUuid(),
    building: 'FORGE',
    category: 'ORE',
    defaultUnlocked: true,
    itemTemplateId: resourceTemplateMap['iron ingot'].id,
    timeMs: 10_000,
    requirement: {
      resources: [{ templateId: resourceTemplateMap['iron ore'].id, amount: 3 }],
      skills: [{ skillId: skillTemplateMap.Smelting.id, level: 1 }],
    },
  },
  {
    id: generateRandomUuid(),
    building: 'FORGE',
    category: 'ORE',
    defaultUnlocked: false,
    itemTemplateId: resourceTemplateMap['copper ingot'].id,
    timeMs: 10_000,
    requirement: {
      resources: [{ templateId: resourceTemplateMap['copper ore'].id, amount: 3 }],
      skills: [{ skillId: skillTemplateMap.Smelting.id, level: 1 }],
    },
  },
] as const satisfies RecipeTemplate[];

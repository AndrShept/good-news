import type { RecipeTemplate } from '@/shared/types';

import { resourceTemplateByKey } from './resource-template';
import { skillTemplateByKey } from './skill-template';
import { weaponTemplateByKey } from './weapon-template';

export const recipeTemplate = [
  {
    id: '019c0f1d-7fae-7157-ab50-ccb50d7a1fa8',

    defaultUnlocked: true,
    itemTemplateId: weaponTemplateByKey.broadsword.id,
    timeMs: 10_000,
    requirement: {
      resources: [{ templateId: resourceTemplateByKey.IRON_ORE.id, amount: 3 }],
      skills: [{ skillId: skillTemplateByKey.SMELTING.id, level: 1 }],
      building: 'BLACKSMITH',
      category: 'ORE',
      coreResource: true
    },
  },
  {
    id: '019bbdf1-110a-780b-95fe-cedb029252a3',

    defaultUnlocked: true,
    itemTemplateId: resourceTemplateByKey.IRON_INGOT.id,
    timeMs: 10_000,
    requirement: {
      resources: [{ templateId: resourceTemplateByKey.IRON_ORE.id, amount: 3 }],
      skills: [{ skillId: skillTemplateByKey.SMELTING.id, level: 1 }],
      building: 'FORGE',
      category: 'ORE',
    },
  },
  {
    id: '019bbdf1-505f-7dfc-bf88-bfc3a4847bf0',

    defaultUnlocked: true,
    itemTemplateId: resourceTemplateByKey.COPPER_INGOT.id,
    timeMs: 10_000,
    requirement: {
      resources: [{ templateId: resourceTemplateByKey.COPPER_ORE.id, amount: 3 }],
      skills: [{ skillId: skillTemplateByKey.SMELTING.id, level: 1 }],
      building: 'FORGE',
      category: 'ORE',
    },
  },
] as const satisfies RecipeTemplate[];

export const recipeTemplateById = recipeTemplate.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, RecipeTemplate>,
);

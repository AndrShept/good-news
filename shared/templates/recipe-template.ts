import type { RecipeTemplate } from '@/shared/types';

import { skillTemplateByKey } from './skill-template';
import { weaponTemplateByKey } from './weapon-template';

export const recipeTemplate = [
  {
    id: '019c0f1d-7fae-7157-ab50-ccb50d7a1fa8',

    defaultUnlocked: true,
    itemTemplateId: weaponTemplateByKey.broadsword.id,
    timeMs: 10_000,
    requirement: {
      materials: [{ amount: 9 , role: 'CORE', categories: ['INGOT', 'PLANK']}],
      skills: [{ skillTemplateId: skillTemplateByKey.BLACKSMITHING.id, level: 1 }],
      buildingCraftLocation: 'BLACKSMITH'
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

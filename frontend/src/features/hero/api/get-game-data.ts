import { armorTemplate } from '@/shared/templates/armor-template';
import { buffTemplate } from '@/shared/templates/buff-template';
import { potionTemplate } from '@/shared/templates/potion-template';
import { recipeTemplate } from '@/shared/templates/recipe-template';
import { resourceTemplate } from '@/shared/templates/resource-template';
import { shieldTemplate } from '@/shared/templates/shield-template';
import { skillsTemplate } from '@/shared/templates/skill-template';
import { weaponTemplate } from '@/shared/templates/weapon-template';
import { queryOptions } from '@tanstack/react-query';

export const getGameData = () => {
  const itemsTemplate = [...armorTemplate, ...potionTemplate, ...resourceTemplate, ...shieldTemplate, ...weaponTemplate];

  return { itemsTemplate, skillsTemplate, recipeTemplate, buffTemplate };
};

export const getGameDataOptions = () =>
  queryOptions({
    queryKey: ['GAME_DATA'],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: getGameData,
  });

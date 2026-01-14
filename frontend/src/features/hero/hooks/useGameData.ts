import { BuffTemplate, ItemTemplate, RecipeTemplate, SkillTemplate } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

import { getGameDataOptions } from '../api/get-game-data';

export const useGameData = () => {
  const { data } = useQuery(getGameDataOptions());
  const itemsTemplateById = data!.itemsTemplate.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, ItemTemplate>,
  );
  const skillsTemplateById = data!.skillsTemplate.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, SkillTemplate>,
  );
  const recipeTemplateById = data!.recipeTemplate.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, RecipeTemplate>,
  );
  const buffTemplateById = data!.buffTemplate.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, BuffTemplate>,
  );

  return {
    itemsTemplateById,
    skillsTemplateById,
    recipeTemplateById,
    buffTemplateById,
  };
};

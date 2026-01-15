import { BuffTemplate, ItemTemplate, RecipeTemplate, SkillTemplate } from '@/shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getGameDataOptions } from '../api/get-game-data';

export const useGameData = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(getGameDataOptions().queryKey);

  const itemsTemplateById = useMemo(
    () =>
      data!.itemsTemplate.reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<string, ItemTemplate>,
      ),
    [],
  );
  const skillsTemplateById = useMemo(
    () =>
      data!.skillsTemplate.reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<string, SkillTemplate>,
      ),
    [],
  );
  const recipeTemplateById = useMemo(
    () =>
      data!.recipeTemplate.reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<string, RecipeTemplate>,
      ),
    [],
  );
  const buffTemplateById = useMemo(
    () =>
      data!.buffTemplate.reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<string, BuffTemplate>,
      ),
    [],
  );

  return {
    itemsTemplateById,
    skillsTemplateById,
    recipeTemplateById,
    buffTemplateById,
    itemsTemplate: data?.itemsTemplate,
  };
};

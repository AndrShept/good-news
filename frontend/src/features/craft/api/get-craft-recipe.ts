import { client } from '@/lib/utils';
import { BuildingType } from '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

export const getCraftRecipe = async (heroId: string, buildingType: BuildingType) => {
  try {
    const res = await client.hero[':id']['craft-recipe'][':buildingType'].$get({
      param: { id: heroId, buildingType },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCraftRecipeOptions = (heroId: string, buildingType: BuildingType | null | undefined) =>
  queryOptions({
    queryKey: ['craft-recipe', buildingType],
    queryFn: () => getCraftRecipe(heroId, buildingType!),
    enabled: buildingType === 'BLACKSMITH' || buildingType === 'FORGE',
  });

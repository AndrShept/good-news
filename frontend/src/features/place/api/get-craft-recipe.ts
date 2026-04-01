import { client } from '@/lib/utils';
import { BuildingKey, CraftBuildingKey, craftBuildingValues } from '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

export const getCraftRecipe = async (heroId: string, buildingKey: BuildingKey) => {
  try {
    const res = await client.hero[':id']['craft-recipe'][':buildingType'].$get({
      param: { id: heroId, buildingType: buildingKey },
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

export const getCraftRecipeOptions = (heroId: string, buildingKey: BuildingKey) =>
  queryOptions({
    queryKey: ['craft-recipe', buildingKey],
    queryFn: () => getCraftRecipe(heroId, buildingKey),
    enabled: craftBuildingValues.includes(buildingKey as CraftBuildingKey),
  });

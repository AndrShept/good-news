import { client } from '@/lib/utils';
import { BuildingType } from '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

export const getCraftItem = async (buildingType: BuildingType) => {
  try {
    const res = await client['craft-item'][':buildingType'].$get({
      param: { buildingType },
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

export const getCraftItemOptions = (buildingType: BuildingType | null | undefined) =>
  queryOptions({
    queryKey: ['craft-item', buildingType],
    queryFn: () => getCraftItem(buildingType!),
    enabled: (buildingType === 'BLACKSMITH' || buildingType === 'FORGE') && !!buildingType,
  });

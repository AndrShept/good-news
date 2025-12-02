import { client } from '@/lib/utils';
import { BuildingType } from '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

export const getQueueCraftItems = async (heroId: string, buildingType: BuildingType | undefined | null) => {
  if (!buildingType) return;
  try {
    const res = await client.hero[':id'].queue['craft-item'][':buildingType'].$get({
      param: {
        id: heroId,
        buildingType,
      },
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

export const getQueueCraftItemOptions = (heroId: string, buildingType: BuildingType | undefined | null) =>
  queryOptions({
    queryKey: ['queue-craft-items', heroId, buildingType],
    queryFn: () => getQueueCraftItems(heroId, buildingType),
    enabled: buildingType === 'BLACKSMITH' || buildingType === 'FORGE',
  });

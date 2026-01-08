import { client } from '@/lib/utils';
import { BuildingType } from '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

export const getShopItem = async (buildingType: BuildingType) => {
  try {
    const res = await client.shop[':buildingType'].$get({ param: { buildingType } });
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getShopItemsOptions = (buildingType: BuildingType) =>
  queryOptions({
    queryKey: ['shop', buildingType],
    queryFn: () => getShopItem(buildingType),
  });

import { client } from '@/lib/utils';
import { ItemContainerType } from '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

export const getItemContainerByType = async (id: string, type: ItemContainerType) => {
  try {
    const res = await client.hero[':id']['item-container'][':type'].$get({
      param: { id, type },
    });
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getItemContainerByTypeOptions = (heroId: string, type: ItemContainerType) =>
  queryOptions({
    queryKey: [heroId, type],
    queryFn: () => getItemContainerByType(heroId, type),
  });

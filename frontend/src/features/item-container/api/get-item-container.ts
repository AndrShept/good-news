import { client } from '@/lib/utils';
import { ItemContainerType } from '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

export const getItemContainer = async (id: string, itemContainerId: string) => {
  try {
    const res = await client.hero[':id']['item-container'][':itemContainerId'].$get({
      param: { id, itemContainerId },
    });
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getItemContainerOptions = (heroId: string, itemContainerId: string) =>
  queryOptions({
    queryKey: ['container', itemContainerId],
    queryFn: () => getItemContainer(heroId, itemContainerId),
  });

import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getInventory = async (id: string) => {
  try {
    const res = await client.hero[':id'].inventories.$get({
      param: { id },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getInventoryOptions = (id: string) =>
  queryOptions({
    queryKey: ['inventory'],
    queryFn: () => getInventory(id),
    staleTime: Infinity,
  });

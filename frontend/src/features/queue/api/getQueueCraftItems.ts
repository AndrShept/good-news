import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getQueueCraftItems = async (heroId: string) => {
  try {
    const res = await client.hero[':id'].queue['craft-item'].$get({
      param: {
        id: heroId,
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

export const getQueueCraftItemOptions = (heroId: string) =>
  queryOptions({
    queryKey: ['queue-craft-items', heroId],
    queryFn: () => getQueueCraftItems(heroId),
    enabled: !!heroId,
  });

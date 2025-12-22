import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getBankItemContainers = async (heroId: string) => {
  try {
    const res = await client.hero[':id']['item-container'].$get({
      param: {
        id: heroId,
      },
    });
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getBankItemContainersOptions = (heroId: string) =>
  queryOptions({
    queryKey: ['bank-containers', heroId],
    queryFn: () => getBankItemContainers(heroId),
  });

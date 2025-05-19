import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getShopItem = async () => {
  try {
    const res = await client.shop.$get();
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getShopItemsOptions = () =>
  queryOptions({
    queryKey: ['shop'],
    queryFn: getShopItem,
    staleTime: Infinity,
  });

import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getCraftItem = async () => {
  try {
    const res = await client['craft-item'].$get();
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCraftItemOptions = () =>
  queryOptions({
    queryKey: ['craft-item'],
    queryFn: getCraftItem,

  });

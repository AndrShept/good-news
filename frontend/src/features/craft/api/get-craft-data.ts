import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getCraftData = async () => {
  try {
    const res = await client['craft']['data'].$get();
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCraftDataOptions = () =>
  queryOptions({
    queryKey: ['craft-data'],
    queryFn: getCraftData,
    gcTime: Infinity
  });

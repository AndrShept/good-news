import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getUser = async () => {
  try {
    const res = await client.auth.user.$get();
    console.log(res);
    if (res.ok) {
      return (await res.json()).data;
    }
    return undefined;
  } catch (error) {
    console.error(error);
  }
};

export const getUserQueryOptions = () =>
  queryOptions({
    queryKey: ['user'],
    queryFn: getUser,
  });

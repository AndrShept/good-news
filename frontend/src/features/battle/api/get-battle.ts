import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getBattle = async (heroId: string, battleId: string) => {
  // await new Promise((r) => setTimeout(r, 3000));
  const res = await client.hero[':id'].battles[':battleId'].$get({
    param: { id: heroId, battleId },
  });
  const data = await res.json();

  return data.data;
};

export const getBattleOptions = (heroId: string, battleId: string) =>
  queryOptions({
    queryKey: ['battle', battleId],
    queryFn: () => getBattle(heroId, battleId),
    enabled : !!battleId
  });

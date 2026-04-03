import { getHeroOptions } from '@/features/hero/api/get-hero';
import { ApiGetHeroResponse } from '@/shared/types';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export const useHero = <T = ApiGetHeroResponse>(select: (data: ApiGetHeroResponse | undefined) => T): T => {
  const { data } = useSuspenseQuery({
    ...getHeroOptions(),
    select,
  });

  return data;
};

export const useHeroRef = <T = ApiGetHeroResponse>(fn: (data: ApiGetHeroResponse) => T): T => {
  const queryClient = useQueryClient();
  const hero = queryClient.getQueryData<ApiGetHeroResponse>(getHeroOptions().queryKey);
  if (!hero) throw new Error('useHeroRef hero not found');
  const data = fn(hero);
  return data;
};

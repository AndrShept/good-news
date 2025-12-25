import { getHeroOptions } from '@/features/hero/api/get-hero';
import { Hero } from '@/shared/types';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export const useHero = <T = Hero>(select: (data: Hero | undefined) => T): T => {
  const { data } = useSuspenseQuery({
    ...getHeroOptions(),
    select,
  });

  return data;
};

export const useHeroRef = <T = Hero>(fn: (data: Hero) => T): T => {
  const queryClient = useQueryClient();
  const hero = queryClient.getQueryData<Hero>(getHeroOptions().queryKey);
  if (!hero) throw new Error('useHeroRef hero not found');
  const data = fn(hero);
  return data;
};

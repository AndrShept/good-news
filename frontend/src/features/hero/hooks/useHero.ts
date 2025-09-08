import { getHeroOptions } from '@/features/hero/api/get-hero';
import { ApiHeroResponse, Hero } from '@/shared/types';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export const useHero = <T = ApiHeroResponse>(fn?: (data: ApiHeroResponse | undefined) => T): T => {
  const { data } = useSuspenseQuery({ ...getHeroOptions(), select: fn });
  return data;
};

export const useHeroRef = <T = ApiHeroResponse>(fn: (data: ApiHeroResponse | undefined) => T): T => {
  const queryClient = useQueryClient();
  const hero = queryClient.getQueryData<ApiHeroResponse>(getHeroOptions().queryKey);
  const data =  fn(hero);
  return data
};

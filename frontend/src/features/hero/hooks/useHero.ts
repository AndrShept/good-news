import { getHeroOptions } from '@/features/hero/api/get-hero';
import { ApiHeroResponse, Hero } from '@/shared/types';
import {  useSuspenseQuery } from '@tanstack/react-query';


export const useHero = <T = ApiHeroResponse>(fn?: (data: ApiHeroResponse | undefined) => T): T => {
  const { data } = useSuspenseQuery({ ...getHeroOptions(), select: fn });
  return data;
};

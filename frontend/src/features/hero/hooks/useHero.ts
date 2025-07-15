import { getHeroOptions } from '@/features/hero/api/get-hero';
import { ApiHeroResponse } from '@/shared/types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useHero = <T = ApiHeroResponse>(fn?: (data: ApiHeroResponse | undefined) => T): T => {
  const { data } = useSuspenseQuery({ ...getHeroOptions(), select: fn });
  return data;
};

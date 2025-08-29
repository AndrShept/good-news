import { getHeroOptions } from '@/features/hero/api/get-hero';
import { ApiHeroResponse, Hero } from '@/shared/types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useHero = <T = ApiHeroResponse>(fn?: (data: ApiHeroResponse | undefined) => T): T => {
  const { data } = useSuspenseQuery({ ...getHeroOptions(), select: fn });
  return data;
};

const selectTile = (data: Hero) => data.tile;
export const useHeroTile = () => {
  return useHero(selectTile);
};

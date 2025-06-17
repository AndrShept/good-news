import { getHeroOptions } from '@/features/hero/api/get-hero';
import { Hero } from '@/shared/types';
import {  useSuspenseQuery } from '@tanstack/react-query';

export const useHero = () => {
  const { data: hero } = useSuspenseQuery(getHeroOptions());
  return hero?.data  as Hero
};

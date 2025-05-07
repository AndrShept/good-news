import { getHeroOptions } from '@/features/hero/api/get-hero';
import { Hero } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

export const useHero = () => {
  const queryClient = useQueryClient();
  const hero = queryClient.getQueryData(getHeroOptions().queryKey)
  return hero?.data as Hero;
};

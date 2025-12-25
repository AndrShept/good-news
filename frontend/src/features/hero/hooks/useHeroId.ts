import { useQueryClient } from '@tanstack/react-query';

import { getHeroOptions } from '../api/get-hero';

export const useHeroId = () => {
  const queryClient = useQueryClient();

  const hero = queryClient.getQueryData(getHeroOptions().queryKey);
  if (!hero) {
    throw new Error('useHeroId ,hero not found');
  }
  return hero.id;
};

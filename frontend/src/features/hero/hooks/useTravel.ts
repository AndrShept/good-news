import { useMutation } from '@tanstack/react-query';

import { HeroTravel, heroTravel } from '../api/hero-travel';
import { useHeroId } from './useHeroId';

export const useTravel = () => {
  const heroId = useHeroId();
  return useMutation({
    mutationFn: ({ entranceId, placeId }: Omit<HeroTravel, 'heroId'>) =>
      heroTravel({
        heroId,
        entranceId,
        placeId,
      }),
  });
};

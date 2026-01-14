import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useQuery } from '@tanstack/react-query';

import { getItemContainerOptions } from '../api/get-item-container';
import { useGetBackpackId } from './useGetBackpackId';

export const useHeroBackpack = () => {
  const backpackId = useGetBackpackId();
  const heroId = useHeroId();
  const { data: backpack, isLoading } = useQuery(getItemContainerOptions(heroId, backpackId));

  return {
    backpack,
    backpackId,
    isLoading,
  };
};

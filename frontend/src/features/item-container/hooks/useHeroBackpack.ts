import { useHeroId } from '@/features/hero/hooks/useHeroId';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getItemContainerOptions } from '../api/get-item-container';
import { useGetBackpackId } from './useGetBackpackId';

export const useHeroBackpack = () => {
  const backpackId = useGetBackpackId();
  const heroId = useHeroId();
  const { data: backpack, isLoading } = useQuery(getItemContainerOptions(heroId, backpackId));

  const stackedItems  = useMemo(
    () =>
      backpack?.itemsInstance.reduce(
        (acc, item) => {
          acc[item.itemTemplateId] += item.quantity;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [backpack?.itemsInstance],
  );

  return {
    backpack,
    backpackId,
    isLoading,
    stackedItems
  };
};

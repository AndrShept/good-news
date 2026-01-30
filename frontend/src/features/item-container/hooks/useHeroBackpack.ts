import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { ResourceCategoryType } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { getItemContainerOptions } from '../api/get-item-container';
import { useGetBackpackId } from './useGetBackpackId';

export const useHeroBackpack = () => {
  const backpackId = useGetBackpackId();
  const heroId = useHeroId();
  const { data: backpack, isLoading } = useQuery(getItemContainerOptions(heroId, backpackId));
  const { itemsTemplateById } = useGameData();
  const stackedItems = useMemo(
    () =>
      backpack?.itemsInstance.reduce(
        (acc, item) => {
          if (!acc[item.itemTemplateId]) {
            acc[item.itemTemplateId] = 0;
          }
          acc[item.itemTemplateId] += item.quantity;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [backpack?.itemsInstance],
  );
  const getStackedResourceItemsByCategory = useCallback(
    (category: ResourceCategoryType) =>
      backpack?.itemsInstance
        .filter((r) => itemsTemplateById[r.itemTemplateId].resourceInfo?.category === category)
        .reduce(
          (acc, item) => {
            if (!acc[item.itemTemplateId]) {
              acc[item.itemTemplateId] = 0;
            }
            acc[item.itemTemplateId] += item.quantity;
            return acc;
          },
          {} as Record<string, number>,
        ),
    [backpack?.itemsInstance, itemsTemplateById],
  );

  return {
    backpack,
    backpackId,
    isLoading,
    stackedItems,
    getStackedResourceItemsByCategory,
  };
};

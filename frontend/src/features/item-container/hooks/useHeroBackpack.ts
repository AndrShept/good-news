import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { RefiningBuildingKey, ResourceCategoryType } from '@/shared/types';
import { itemRefineableForBuilding } from '@/shared/utils';
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
    (categories: ResourceCategoryType[]) =>
      backpack?.itemsInstance
        .filter((r) => {
          if (!itemsTemplateById[r.itemTemplateId].resourceInfo?.category) return;
          return categories.includes(itemsTemplateById[r.itemTemplateId].resourceInfo!.category);
        })
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

  const filteredByRefineBuilding = useMemo(
    () => (building: RefiningBuildingKey) => {
      if (!backpack) return;

      return {
        ...backpack,

        itemsInstance: backpack.itemsInstance.filter((i) => {
          return itemRefineableForBuilding({
            coreResource: i.coreResource,
            itemTemplateId: i.itemTemplateId,
            refiningBuildingKey: building,
          })?.isCanRefine;
        }),
      };
    },
    [backpack],
  );

  return {
    backpack,
    backpackId,
    isLoading,
    stackedItems,
    getStackedResourceItemsByCategory,
    filteredByRefineBuilding,
  };
};

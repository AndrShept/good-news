import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { resourceTemplateById } from '@/shared/templates/resource-template';
import { RefiningBuildingKey, ResourceCategoryType } from '@/shared/types';
import { refineItems } from '@/shared/utils';
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

  const filteredByRefineBuilding = (building: RefiningBuildingKey) => {
    if (!backpack) return;

    return {
      ...backpack,

      itemsInstance: backpack.itemsInstance.filter((i) => {
        const itemTemplate = i.coreResource ? itemsTemplateById[i.itemTemplateId] : resourceTemplateById[i.itemTemplateId];
        switch (itemTemplate.type) {
          case 'RESOURCES':
            return refineItems[building].RESOURCES.includes(itemTemplate.key);
          case 'WEAPON': {
            if (i.coreResource) {
              return refineItems[building].WEAPON.includes(i.coreResource);
            }
            break;
          }
          case 'ARMOR': {
            if (i.coreResource) {
              return refineItems[building].ARMOR.includes(i.coreResource);
            }
            break;
          }
        }
      }),
    };
  };

  return {
    backpack,
    backpackId,
    isLoading,
    stackedItems,
    getStackedResourceItemsByCategory,
    filteredByRefineBuilding,
  };
};

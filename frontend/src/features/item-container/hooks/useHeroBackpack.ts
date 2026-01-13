import { useCraftItem } from '@/features/craft/hooks/useCraftItem';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { ResourceType } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getItemContainerOptions } from '../api/get-item-container';
import { useGetBackpackId } from './useGetBackpackId';

export const useHeroBackpack = () => {
  const backpackId = useGetBackpackId();
  const heroId = useHeroId();
  const { data: backpack, isLoading } = useQuery(getItemContainerOptions(heroId, backpackId));
  const { allResourcesByType } = useCraftItem();
  const resourceCountInBackpack = useMemo(() => {
    const result: Partial<Record<ResourceType, number>> = {};

    if (!backpack) return;
    if (!allResourcesByType?.length) return;
    for (const resource of allResourcesByType) {
      if(!resource) continue
      for (const backpackItem of backpack.itemsInstance) {
        if (backpackItem.itemTemplate.resourceInfo?.type === resource) {
          result[resource] = (result[resource] ?? 0) + backpackItem.quantity;
        }
      }
    }
    return result;
  }, [allResourcesByType, backpack]);
  return {
    resourceCountInBackpack,
    backpack,
    backpackId,
    isLoading,
  };
};

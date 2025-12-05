import { useCraftItem } from '@/features/craft/hooks/useCraftItem';
import { Resource, ResourceType } from '@/shared/types';
import { useMemo } from 'react';

import { useGetBackpackId } from './useGetBackpackId';
import { useItemContainer } from './useItemContainer';

export const useHeroBackpack = () => {
  const backpackId = useGetBackpackId();
  const backpack = useItemContainer(backpackId);
  const { allResourcesByType } = useCraftItem();
  const resourceCountInBackpack = useMemo(() => {
    const result: Partial<Record<ResourceType, number>> = {};

    if (!backpack?.containerSlots?.length) return;
    if (!allResourcesByType?.length) return;
    for (const resource of allResourcesByType) {
      for (const backpackItem of backpack.containerSlots) {
        if (backpackItem?.gameItem?.resource?.type === resource) {
          result[resource] = (result[resource] ?? 0) + backpackItem.quantity;
        }
      }
    }
    return result;
  }, [allResourcesByType, backpack?.containerSlots]);
  return {
    resourceCountInBackpack,
    backpack,
    backpackId,
  };
};

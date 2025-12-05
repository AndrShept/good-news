import { Resource, ResourceType } from '@/shared/types';
import { useMemo } from 'react';

import { useGetBackpackId } from './useGetBackpackId';
import { useItemContainer } from './useItemContainer';

export const useHeroBackpack = () => {
  const backpackId = useGetBackpackId();
  const backpack = useItemContainer(backpackId);
  const calculateSumBackpackResource = useMemo(
    () => (resources: ResourceType[] | undefined) => {
      const result: Partial<Record<ResourceType, number>> = {};

      if (!backpack?.containerSlots?.length) return;
      if (!resources?.length) return;
      for (const resource of resources) {
        for (const backpackItem of backpack.containerSlots) {
          if (backpackItem?.gameItem?.resource?.type === resource) {
            result[resource] = (result[resource] ?? 0) + backpackItem.quantity;
          }
        }
      }
      return result;
    },
    [backpack?.containerSlots],
  );
  return {
    calculateSumBackpackResource,
    backpack,
    backpackId,
  };
};

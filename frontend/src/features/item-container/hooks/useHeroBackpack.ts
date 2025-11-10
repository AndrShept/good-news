import { Resource, ResourceType } from '@/shared/types';
import { useMemo } from 'react';

import { useItemContainerByType } from './useItemContainerByType';

export const useHeroBackpack = () => {
  const containerSlots = useItemContainerByType('BACKPACK', (data) => data?.containerSlots);
  const calculateSumBackpackResource = useMemo(
    () => (resources: Resource[]) => {
      const result: Partial<Record<ResourceType, number>> = {};

      if (!containerSlots?.length) return;
      for (const recourse of resources) {
        for (const backpackItem of containerSlots) {
          if (backpackItem?.gameItem?.resource?.type === recourse.type) {
            result[recourse.type] = (result[recourse.type] ?? 0) + backpackItem.quantity;
          }
        }
      }
      return result;
    },
    [containerSlots],
  );
  return {
    calculateSumBackpackResource,
  };
};

import { useHero } from '@/features/hero/hooks/useHero';
import { Resource, ResourceType } from '@/shared/types';
import { useMemo } from 'react';

import { useGetBackpackId } from './useGetBackpackId';
import { useItemContainer } from './useItemContainer';

export const useHeroBackpack = () => {
  const backpackId = useGetBackpackId();
  const backpack = useItemContainer(backpackId);
  const calculateSumBackpackResource = useMemo(
    () => (resources: Resource[]) => {
      const result: Partial<Record<ResourceType, number>> = {};

      if (!backpack?.containerSlots?.length) return;
      for (const resource of resources) {
        for (const backpackItem of backpack.containerSlots) {
          if (backpackItem?.gameItem?.resource?.type === resource.type) {
            result[resource.type] = (result[resource.type] ?? 0) + backpackItem.quantity;
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

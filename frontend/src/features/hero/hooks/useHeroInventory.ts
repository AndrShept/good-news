import { Resource, ResourceType } from '@/shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getInventoryOptions } from '../api/get-inventory';
import { useHeroId } from './useHeroId';

export const useHeroInventory = () => {
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const { data: inventories } = useQuery(getInventoryOptions(heroId))
  const calculateSumInventoryResource = useMemo(
    () => (resources: Resource[]) => {
      const result: Partial<Record<ResourceType, number>> = {};
      if (!inventories?.length) return;
      for (const recourse of resources) {
        for (const inventory of inventories) {
          if (inventory?.gameItem?.resource?.type === recourse.type) {
         result[recourse.type] = (result[recourse.type] ?? 0) + inventory.quantity;
          }
        }
      }
      return result;
    },
    [inventories],
  );
  return {
    calculateSumInventoryResource,
  };
};

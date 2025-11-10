import { ItemContainer, Resource, ResourceType } from '@/shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useHeroId } from '../../hero/hooks/useHeroId';
import { getItemContainerByTypeOptions } from '../api/get-item-container-by-type';

export const useHeroBackpack = <T extends Partial<ItemContainer>>(select?: (data: ItemContainer | undefined) => T | undefined): T => {
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const { data: backpack } = useQuery({ ...getItemContainerByTypeOptions(heroId, 'BACKPACK'), select: select ? select : undefined });
  const calculateSumBackpackResource = useMemo(
    () => (resources: Resource[]) => {
      const result: Partial<Record<ResourceType, number>> = {};
      if (!backpack?.containerSlots?.length) return;
      for (const recourse of resources) {
        for (const backpackItem of backpack.containerSlots) {
          if (backpackItem?.gameItem?.resource?.type === recourse.type) {
            result[recourse.type] = (result[recourse.type] ?? 0) + backpackItem.quantity;
          }
        }
      }
      return result;
    },
    [backpack?.containerSlots],
  );
  return {
    calculateSumBackpackResource,
  };
};

import { CraftItem } from '@/shared/types';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCraftItemOptions } from '../api/get-craft-item';

export const useCraftItem = () => {
  const queryClient = useQueryClient();
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const data = queryClient.getQueryData(getCraftItemOptions(selectBuilding?.type).queryKey);

  const craftItemMap = useMemo(() => {
    if (!data) return {};

    return data.craftItems.reduce(
      (acc, item) => {
        if (!item) return acc;
        acc[item.id] = item;
        return acc;
      },
      {} as Record<string, CraftItem>,
    );
  }, [data]);

  return {
    craftItemMap,
  };
};

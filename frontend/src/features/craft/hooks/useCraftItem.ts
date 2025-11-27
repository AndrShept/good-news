import { CraftItem, Modifier, ResourceType } from '@/shared/types';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCraftItemOptions } from '../api/get-craft-item';

export const useCraftItem = () => {
  const queryClient = useQueryClient();
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const data = queryClient.getQueryData(getCraftItemOptions(selectBuilding?.type).queryKey);
  const filteredResourcesBySelectBuilding = useMemo(() => {
    return data?.resources.filter((r) => r.category === selectBuilding?.workingResourceCategory);
  }, [data?.resources, selectBuilding?.workingResourceCategory]);
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

  const resourceMap = useMemo(
    () =>
      data?.resources?.reduce(
        (acc, item) => {
          if (!item?.gameItem) return acc;
          const typedKey = item.type as ResourceType;
          acc[typedKey] = { image: item.gameItem.image, modifier: item.modifier ? item.modifier : null };
          return acc;
        },
        {} as Record<ResourceType, { image: string; modifier: Modifier | null }>,
      ),
    [data?.resources],
  );

  return {
    craftItemMap,
    resourceMap,

    filteredResourcesBySelectBuilding,
  };
};

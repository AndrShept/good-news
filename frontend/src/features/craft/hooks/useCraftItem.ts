import { CraftItem } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getCraftItemOptions } from '../api/get-craft-item';

export const useCraftItem = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(getCraftItemOptions().queryKey);

  const craftItemMap = useMemo(() => {
    if (!data) return {};

    return data.craftItems
      .flatMap((craft) => craft.subgroups.flatMap((sub) => sub.items))
      .reduce(
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

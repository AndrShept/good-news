import { ItemInstance } from '@/shared/types';
import { useMemo } from 'react';

export const useCreateContainerItems = (capacity: number, containerInstanceItems: ItemInstance[]) => {
  const containerSlots = useMemo(() => {
    return Array.from({ length: capacity ?? 1 }, (_, idx) => {
      const item = containerInstanceItems?.[idx];
      if (item) {
        return item;
      }
      return null;
    });
  }, [containerInstanceItems, capacity]);

  return containerSlots;
};

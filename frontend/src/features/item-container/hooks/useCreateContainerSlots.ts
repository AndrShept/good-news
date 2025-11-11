import { ContainerSlot } from '@/shared/types';
import { useMemo } from 'react';

export const useCreateContainerSlots = (maxSlots: number | undefined, containerSlotItems: ContainerSlot[] | null | undefined) => {
  const containerSlots = useMemo(() => {
    return Array.from({ length: maxSlots ?? 1 }, (_, idx) => {
      const item = containerSlotItems?.[idx] ;
      if (item) {
        return item;
      }
      return null;
    });
  }, [containerSlotItems, maxSlots]);

  return containerSlots;
};

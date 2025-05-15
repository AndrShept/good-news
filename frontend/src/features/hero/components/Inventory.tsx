import { useHero } from '@/features/hero/hooks/useHero';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getInventoryOptions } from '../api/get-inventory';

export const Inventory = () => {
  const { inventorySlotMax, id } = useHero();
  const { data: inventories } = useSuspenseQuery(getInventoryOptions(id));
  const inventoriesData = useMemo(() => {
    return Array.from({ length: inventorySlotMax }, (_, idx) => {
      const item = inventories?.data?.[idx];
      if (item) {
        return item;
      }
      return null;
    });
  }, [inventories?.data, inventorySlotMax]);
  return (
    <ul className="flex h-fit flex-wrap gap-1">
      {inventoriesData.map((inventory, idx) => (
        <li key={idx} className="size-12 border" />
      ))}
    </ul>
  );
};

import { GameItemCard } from '@/components/GameItemCard';
import { GameItemSlot } from '@/components/GameItemSlot';
import { useHero } from '@/features/hero/hooks/useHero';
import { useSuspenseQuery } from '@tanstack/react-query';
import { memo, useMemo } from 'react';

import { getInventoryOptions } from '../api/get-inventory';

export const Inventory = memo(() => {
  const { id, maxInventorySlots } = useHero((state) => ({
    maxInventorySlots: state?.data?.maxInventorySlots ?? 0,
    id: state?.data?.id ?? '',
  }));
  const { data: inventories } = useSuspenseQuery(getInventoryOptions(id));
  const inventoriesData = useMemo(() => {
    return Array.from({ length: maxInventorySlots }, (_, idx) => {
      const item = inventories?.data?.[idx];
      if (item) {
        return item;
      }
      return null;
    });
  }, [inventories?.data, maxInventorySlots]);
  return (
    <ul className="flex h-fit flex-wrap gap-1">
      {inventoriesData.map((inventory, idx) => {
        if (!inventory) return <GameItemSlot key={idx} />;
        return <GameItemCard key={inventory.id} {...inventory} />;
      })}
    </ul>
  );
});

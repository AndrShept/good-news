import { GameItemCard } from '@/components/GameItemCard';
import { useHero } from '@/features/hero/hooks/useHero';
import { GameItemType } from '@/shared/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { p } from 'motion/react-m';
import { useMemo, useState } from 'react';

import { getInventoryOptions } from '../api/get-inventory';

export const Inventory = () => {
  const { maxInventorySlots, id } = useHero();
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
      {inventoriesData.map((inventory) => (
        <GameItemCard key={inventory?.id} gameItem={inventory?.gameItem} quantity={inventory?.quantity} />
      ))}
    </ul>
  );
};

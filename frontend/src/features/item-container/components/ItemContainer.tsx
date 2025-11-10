import { GameItemCard } from '@/components/GameItemCard';
import { GameItemSlot } from '@/components/GameItemSlot';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useSuspenseQuery } from '@tanstack/react-query';
import { memo, useMemo } from 'react';

import { getItemContainerByTypeOptions } from '../api/get-item-container-by-type';

export const ItemContainer = memo(() => {
  const id = useHeroId();
  const { data } = useSuspenseQuery(getItemContainerByTypeOptions(id, 'BACKPACK'));
  const containerSlots = useMemo(() => {
    return Array.from({ length: data?.maxSlots ?? 1 }, (_, idx) => {
      const item = data?.containerSlots?.[idx];
      if (item) {
        return item;
      }
      return null;
    });
  }, [data?.containerSlots, data?.maxSlots]);
  return (
    <ul className="flex h-fit flex-wrap gap-1">
      {containerSlots.map((containerItem, idx) => {
        if (!containerItem) return <GameItemSlot key={idx} />;
        return (
          <GameItemCard
            key={containerItem.id}
            id={containerItem.id}
            gameItem={containerItem.gameItem}
            quantity={containerItem.quantity}
            type="BACKPACK"
          />
        );
      })}
    </ul>
  );
});

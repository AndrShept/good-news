import { GameItemImg } from '@/components/GameItemImg';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useHero } from '@/features/hero/hooks/useHero';
import React from 'react';

import { useCraftItem } from '../hooks/useCraftItem';

export const QueueCraftItemsList = () => {
  const { craftItemMap } = useCraftItem();
  const queueCraftItems = useHero((state) => state?.data?.queueCraftItems);
  console.log(queueCraftItems);
  return (
    <ScrollArea className="pb-3">
      <ul className="flex gap-2">
        {queueCraftItems?.map((craftItem) => (
          <li className="flex h-20 w-20 flex-col items-center justify-center border" key={craftItem.id}>
            <GameItemImg className="size-10" image={craftItemMap[craftItem.craftItemId].gameItem?.image} />
            <p className="line-clamp-1 text-sm">{craftItemMap[craftItem.craftItemId].gameItem?.name}</p>
          </li>
        ))}
      </ul>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

import { GameItemImg } from '@/components/GameItemImg';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useHero } from '@/features/hero/hooks/useHero';
import React from 'react';

import { useCraftItem } from '../hooks/useCraftItem';
import { useDeleteQueueCraftItemMutation } from '../hooks/useDeleteQueueCraftItemMutation';

export const QueueCraftItemsList = () => {
  const { craftItemMap } = useCraftItem();
  const queueCraftItems = useHero((state) => state?.data?.queueCraftItems);
  const { mutate, isPending } = useDeleteQueueCraftItemMutation();
  return (
    <ScrollArea className="pb-3">
      <ul className="flex gap-2">
        {queueCraftItems?.map((queueItem) => (
          <li className="flex h-auto w-20 flex-col gap-1 items-center justify-center " key={queueItem.id}>
            <GameItemImg className="size-10" image={craftItemMap[queueItem.craftItemId].gameItem?.image} />
            <p className="line-clamp-1 text-sm">{craftItemMap[queueItem.craftItemId].gameItem?.name}</p>
            <Button variant={'destructive'} className='p-0 w-full h-6' disabled={isPending} onClick={() => mutate(queueItem.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

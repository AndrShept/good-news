import { GameItemImg } from '@/components/GameItemImg';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getQueueCraftItemOptions } from '@/features/queue/api/getQueueCraftItems';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useCraftItem } from '../../craft/hooks/useCraftItem';
import { useDeleteQueueCraftItemMutation } from '../hooks/useDeleteQueueCraftItemMutation';

export const QueueCraftItemsList = () => {
  const { craftItemMap } = useCraftItem();
  const heroId = useHeroId();
  const { data: queueCraftItems } = useQuery(getQueueCraftItemOptions(heroId));
  const { mutate, isPending } = useDeleteQueueCraftItemMutation();
  if (!queueCraftItems?.length) return;
  return (
    <ScrollArea className="pb-2">
      <ul className="flex gap-2 border-y py-2">
        {queueCraftItems?.map((queueItem) => (
          <li className="flex h-auto w-20 flex-col items-center justify-center gap-1" key={queueItem.id}>
            <GameItemImg className="size-10" image={craftItemMap[queueItem.craftItemId].gameItem?.image} />
            <p className="line-clamp-1 text-sm">{craftItemMap[queueItem.craftItemId].gameItem?.name}</p>
            {queueItem.status === 'PROGRESS' && <p className="text-green-500">progress</p>}
            <Button variant={'destructive'} className="w-17 h-6 p-0 text-xs" disabled={isPending} onClick={() => mutate(queueItem.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

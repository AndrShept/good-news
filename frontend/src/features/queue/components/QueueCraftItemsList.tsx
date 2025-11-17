import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getQueueCraftItemOptions } from '@/features/queue/api/getQueueCraftItems';
import { useQuery } from '@tanstack/react-query';

import { useCraftItem } from '../../craft/hooks/useCraftItem';
import { QueueCraftItemCard } from './QueueCraftItemCard';

export const QueueCraftItemsList = () => {
  const { craftItemMap } = useCraftItem();
  const heroId = useHeroId();
  const { data: queueCraftItems } = useQuery(getQueueCraftItemOptions(heroId));
  if (!queueCraftItems?.length) return;
  return (
    <ScrollArea className="pb-2">
      <ul className="flex gap-2  py-2">
        {queueCraftItems?.map((queueItem) => <QueueCraftItemCard key={queueItem.id} {...queueItem} craftItemMap={craftItemMap} />)}
      </ul>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

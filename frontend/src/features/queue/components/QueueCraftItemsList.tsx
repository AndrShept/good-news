import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getQueueCraftItemOptions } from '@/features/queue/api/getQueueCraftItems';
import { cn } from '@/lib/utils';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQuery } from '@tanstack/react-query';

import { QueueCraftItemCard } from './QueueCraftItemCard';

export const QueueCraftItemsList = () => {
  const heroId = useHeroId();
  const maxQueueCraftCount = useHero((data) => data?.maxQueueCraftCount ?? 4);
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const { data: queueCraftItems } = useQuery(getQueueCraftItemOptions(heroId, selectBuilding?.type));
  if (!queueCraftItems?.length) return;
  return (
    <section className="mt-2 flex flex-col">
      <div className="text-muted mx-auto flex">
        <span
          className={cn('', {
            'text-red-500/30': queueCraftItems.length > maxQueueCraftCount,
          })}
        >
          {queueCraftItems.length}
        </span>
        /<span>{maxQueueCraftCount}</span>
      </div>
      <ul className="flex flex-wrap gap-2 py-2">
        {queueCraftItems?.map((queueItem) => <QueueCraftItemCard key={queueItem.id} {...queueItem} />)}
      </ul>
    </section>
  );
};

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getQueueCraftItemOptions } from '@/features/queue/api/getQueueCraftItems';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQuery } from '@tanstack/react-query';

import { useCraftItem } from '../../craft/hooks/useCraftItem';
import { QueueCraftItemCard } from './QueueCraftItemCard';

export const QueueCraftItemsList = () => {
  const { craftItemMap } = useCraftItem();
  const heroId = useHeroId();
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const { data: queueCraftItems } = useQuery(getQueueCraftItemOptions(heroId, selectBuilding?.type));
  if (!queueCraftItems?.length) return;
  return (
    <ul className="flex  flex-wrap gap-2 py-2">
      {queueCraftItems?.map((queueItem) => <QueueCraftItemCard key={queueItem.id} {...queueItem} craftItemMap={craftItemMap} />)}
    </ul>
  );
};

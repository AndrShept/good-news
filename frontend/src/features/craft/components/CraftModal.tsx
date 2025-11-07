import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CraftItem } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { Activity, useState } from 'react';

import { getCraftItemOptions } from '../api/get-craft-item';
import { CraftButton } from './CraftButton';
import { CraftItemCard } from './CraftItemCard';
import { CraftSidebar } from './CraftSidebar';
import { QueueCraftItemsList } from './QueueCraftItemsList';

export const CraftModal = () => {
  const { data, isLoading } = useQuery(getCraftItemOptions());
  const [craftItem, setCraftItem] = useState<CraftItem>();
  const [show, setShow] = useState(false);
  // if (isLoading) return <p>...</p>;
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger>
        <div className="w-fit">Craft</div>
      </DialogTrigger>
      <Activity mode={show ? 'visible' : 'hidden'}>
        <DialogContent className="flex h-[60%] gap-0 p-0 sm:h-[80%] sm:max-w-2xl md:max-w-3xl">
          <CraftSidebar data={data} onSelect={setCraftItem} selectedItemId={craftItem?.id} />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col p-1">
            <div className="min-h-0 flex-1">
              {craftItem && craftItem.gameItem && <CraftItemCard {...craftItem} resources={data?.resources} />}
            </div>
            <QueueCraftItemsList />
            <div className="mx-auto w-[200px] p-3">
              <CraftButton craftItem={craftItem} />
            </div>
          </div>
        </DialogContent>
      </Activity>
    </Dialog>
  );
};

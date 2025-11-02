import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CraftItem } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getCraftItemOptions } from '../api/get-craft-item';
import { CraftItemCard } from './CraftItemCard';
import { CraftSidebar } from './CraftSidebar';

export const CraftModal = () => {
  const { data, isLoading } = useQuery(getCraftItemOptions());
  const [craftItem, setCraftItem] = useState<CraftItem>();

  // if (isLoading) return <p>...</p>;
  return (
    <Dialog
      onOpenChange={() => {
        setCraftItem(undefined);
      }}
    >
      <DialogTrigger>
        <div className="w-fit">Craft</div>
      </DialogTrigger>
      <DialogContent className="h-[60%] overflow-hidden p-0 sm:h-[80%] sm:max-w-2xl md:max-w-3xl">
        <section className="flex min-h-0">
          <CraftSidebar data={data} onSelect={setCraftItem} selectedItemId={craftItem?.id} />
          <div className="flex min-w-[200px] flex-1 flex-col">
            <div className="flex-1 p-2 text-center">
              {craftItem && craftItem.gameItem && <CraftItemCard {...craftItem} resources={data?.resources} />}
            </div>

            <div className="bg-secondary h-40"></div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

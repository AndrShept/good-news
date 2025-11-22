import { CraftItem } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { Activity, useEffect, useState } from 'react';

import { getCraftItemOptions } from '../../../craft/api/get-craft-item';
import { CraftButton } from '../../../craft/components/CraftButton';
import { CraftItemCard } from '../../../craft/components/CraftItemCard';
import { CraftSidebar } from '../../../craft/components/CraftSidebar';
import { QueueCraftItemsList } from '../../../queue/components/QueueCraftItemsList';

type Props = {
  isBlacksmith: boolean;
};
export const Blacksmith = ({ isBlacksmith }: Props) => {
  const { data, isLoading } = useQuery(getCraftItemOptions());
  const [craftItem, setCraftItem] = useState<CraftItem>();

  if (isLoading) return <p>...</p>;
  return (
    <Activity mode={isBlacksmith ? 'visible' : 'hidden'}>
      <section className="flex w-full">
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
      </section>
    </Activity>
  );
};

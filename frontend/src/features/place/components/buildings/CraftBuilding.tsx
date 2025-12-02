import { useCraftItem } from '@/features/craft/hooks/useCraftItem';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQuery } from '@tanstack/react-query';
import { Activity, useEffect, useState } from 'react';

import { getCraftItemOptions } from '../../../craft/api/get-craft-item';
import { CraftButton } from '../../../craft/components/CraftButton';
import { CraftItemCard } from '../../../craft/components/CraftItemCard';
import { CraftSidebar } from '../../../craft/components/CraftSidebar';
import { QueueCraftItemsList } from '../../../queue/components/QueueCraftItemsList';

type Props = {
  isCraftBuilding: boolean;
};
export const CraftBuilding = ({ isCraftBuilding }: Props) => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const { data, isLoading } = useQuery(getCraftItemOptions(selectBuilding?.type));
  const craftItem = useCraftItemStore((state) => state.craftItem);
  const setCraftItem = useCraftItemStore((state) => state.setCraftItem);
  const setCoreMaterial = useCraftItemStore((state) => state.setCoreMaterial);
  const { filteredResourcesBySelectBuilding } = useCraftItem();

  useEffect(() => {
    setCraftItem(data?.craftItems?.[0]);
    setCoreMaterial(filteredResourcesBySelectBuilding?.[0].type ?? null);
  }, [data?.craftItems, filteredResourcesBySelectBuilding, selectBuilding, setCoreMaterial, setCraftItem]);
  if (isLoading) return <p>...</p>;
  return (
    <Activity mode={isCraftBuilding ? 'visible' : 'hidden'}>
      <section className="flex w-full">
        <CraftSidebar data={data} onSelect={setCraftItem} selectedItemId={craftItem?.id} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col p-1">
          <div className="min-h-0 flex-1">{craftItem && craftItem.gameItem && <CraftItemCard {...craftItem} />}</div>
          <QueueCraftItemsList />
          <div className="mx-auto w-[200px] p-3">
            <CraftButton craftItem={craftItem} />
          </div>
        </div>
      </section>
    </Activity>
  );
};

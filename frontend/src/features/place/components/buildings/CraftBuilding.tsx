import { getCraftItemOptions } from '@/features/craft/api/get-craft-item';
import { CraftButton } from '@/features/craft/components/CraftButton';
import { CraftItemCard } from '@/features/craft/components/CraftItemCard';
import { CraftSidebar } from '@/features/craft/components/CraftSidebar';
import { useCraftItem } from '@/features/craft/hooks/useCraftItem';
import { QueueCraftItemsList } from '@/features/queue/components/QueueCraftItemsList';
import { CoreMaterialType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const CraftBuilding = () => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const { data: craftItems, isLoading } = useQuery(getCraftItemOptions(selectBuilding?.type));
  const craftItem = useCraftItemStore((state) => state.craftItem);
  const setCraftItem = useCraftItemStore((state) => state.setCraftItem);
  const setCoreMaterial = useCraftItemStore((state) => state.setCoreMaterial);
  const { filteredResourcesBySelectBuilding } = useCraftItem();

  useEffect(() => {
    setCraftItem(craftItems?.[0]);
    if (selectBuilding?.type === 'BLACKSMITH') {
      setCoreMaterial((filteredResourcesBySelectBuilding?.[0].type as CoreMaterialType) ?? null);
    } else {
      setCoreMaterial(null);
    }
  }, [craftItems, filteredResourcesBySelectBuilding, selectBuilding?.type]);
  if (isLoading) return <p>...</p>;
  return (
    <section className="flex w-full">
      <CraftSidebar craftItems={craftItems} onSelect={setCraftItem} selectedItemId={craftItem?.id} />
      <div className="flex flex-1 flex-col p-1">
        <div className="min-h-0 flex-1">{craftItem  && <CraftItemCard {...craftItem} />}</div>

        {/* <QueueCraftItemsList /> */}

        <div className="mx-auto w-[200px] p-3">
          <CraftButton craftItem={craftItem} buildingType={selectBuilding?.type} />
        </div>
      </div>
    </section>
  );
};

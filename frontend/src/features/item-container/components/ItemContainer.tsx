import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHero } from '@/features/hero/hooks/useHero';
import { GameItemSlot } from '@/features/item-instance/components/GameItemSlot';
import { ItemInstanceCard } from '@/features/item-instance/components/ItemInstanceCard';
import { cn } from '@/lib/utils';
import { RefiningBuildingKey, TItemContainer, refiningBuildingValues } from '@/shared/types';
import { itemRefineableForBuilding } from '@/shared/utils';
import { useSelectPlaceEntitiesStore } from '@/store/useSelectBuildingStore';
import { useSelectedItemId, useSetSelectedItem } from '@/store/useSelectItemInstanceStore';
import { useShopItemStore } from '@/store/useShopItemStore';
import { useDroppable } from '@dnd-kit/core';
import { memo } from 'react';

import { useCreateContainerItems } from '../hooks/useCreateContainerItems';
import { ContainerCapacityInfo } from './ContainerCapacityInfo';

type Props = TItemContainer & {
  isShowContainerHeader?: boolean;
};

export const ItemContainer = memo(({ capacity, id, type, itemsInstance, name, isShowContainerHeader = true }: Props) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id,
    data: { to: { id, type } },
  });
  const selectedPlaceEntities = useSelectPlaceEntitiesStore((state) => state.selectedPlaceEntities);
  const setSelectedItemInstance = useSetSelectedItem();
  const selectedItemId = useSelectedItemId();
  const items = useCreateContainerItems(capacity, itemsInstance);
  const sellItems = useShopItemStore((state) => state.items);
  const { itemsTemplateById } = useGameData();
  const isRefiningBuilding =
    selectedPlaceEntities?.type === 'BUILDING' && refiningBuildingValues.includes(selectedPlaceEntities.payload.key as RefiningBuildingKey);
  const heroState = useHero((data) => data?.state);
  return (
    <section
      ref={setNodeRef}
      className={cn('flex w-full select-none flex-col gap-0.5 border-2 border-transparent', {
        'h-fit border-green-400/50 bg-green-700/10': isOver && active?.data.current?.itemContainerId !== id,
      })}
    >
      {isShowContainerHeader && (
        <div className="flex items-center gap-2">
          <ContainerCapacityInfo usedCapacity={itemsInstance.length} capacity={capacity} iconSize="size-6" />
          <p>{name}</p>
        </div>
      )}

      <ul className="flex w-full flex-wrap gap-1">
        {items?.map((itemInstance) => {
          if (!itemInstance) {
            const id = crypto.randomUUID();
            return <GameItemSlot key={id} />;
          }
          const itemTemplate = itemsTemplateById[itemInstance.itemTemplateId];
          const isSellItem = sellItems.some((i) => i.instanceId === itemInstance.id);
          return (
            <ItemInstanceCard
              key={itemInstance.id}
              isSelect={selectedItemId === itemInstance.id}
              setSelectItemOnContainer={setSelectedItemInstance}
              {...itemInstance}
              heroState={heroState!}
              itemTemplate={itemTemplate}
              isHighlight={
                isRefiningBuilding
                  ? itemRefineableForBuilding({
                      coreResource: itemInstance.coreResource,
                      itemTemplateId: itemInstance.itemTemplateId,
                      refiningBuildingKey: selectedPlaceEntities.payload.key as RefiningBuildingKey,
                    })?.isCanRefine
                  : isSellItem
                    ? false
                    : undefined
              }
    
            />
          );
        })}
      </ul>
    </section>
  );
});

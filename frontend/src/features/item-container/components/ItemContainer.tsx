import { useGameData } from '@/features/hero/hooks/useGameData';
import { GameItemSlot } from '@/features/item-instance/components/GameItemSlot';
import { ItemInstanceCard } from '@/features/item-instance/components/ItemInstanceCard';

import { cn } from '@/lib/utils';
import { TItemContainer } from '@/shared/types';

import {  useSelectedItemId, useSetSelectedItem } from '@/store/useSelectItemInstanceStore';
import { useDroppable } from '@dnd-kit/core';
import { memo } from 'react';

import { useCreateContainerItems } from '../hooks/useCreateContainerItems';
import { ContainerCapacityInfo } from './ContainerCapacityInfo';

type Props = TItemContainer;

export const ItemContainer = memo(({ capacity, id, itemsInstance }: Props) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id,
    data: { to: id },
  });

  const setSelectedItemInstance = useSetSelectedItem(); 
  const selectedItemId = useSelectedItemId();
  
  const items = useCreateContainerItems(capacity, itemsInstance);
  const { itemsTemplateById } = useGameData();

  return (
    <section
      ref={setNodeRef}
      className={cn('flex w-full select-none flex-col gap-0.5 border-2 border-transparent', {
        'h-fit border-green-400/50 bg-green-700/10': isOver && active?.data.current?.itemContainerId !== id,
      })}
    >
      <div className="flex items-center gap-2">
        <ContainerCapacityInfo usedCapacity={itemsInstance.length} capacity={capacity} iconSize="size-6" />
      </div>

      <ul className="flex w-full flex-wrap gap-1">
        {items?.map((itemInstance) => {
          if (!itemInstance) {
            const id = crypto.randomUUID();
            return <GameItemSlot key={id} />;
          }
          const itemTemplate = itemsTemplateById[itemInstance.itemTemplateId];
          return (
            <ItemInstanceCard
              key={itemInstance.id}
              isSelect={selectedItemId === itemInstance.id}
              setSelectItemOnContainer={setSelectedItemInstance}
              {...itemInstance}
              itemTemplate={itemTemplate}
            />
          );
        })}
      </ul>
   
    </section>
  );
});

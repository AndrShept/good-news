import { useGameData } from '@/features/hero/hooks/useGameData';
import { GameItemSlot } from '@/features/item-instance/components/GameItemSlot';
import { ItemInstanceCard } from '@/features/item-instance/components/ItemInstanceCard';
import { useMoveItemInstance } from '@/features/item-instance/hooks/useMoveItemInstance';
import { cn } from '@/lib/utils';
import { TItemContainer } from '@/shared/types';
import { useDragContainerStore } from '@/store/useDragContainerStore';
import { memo, useRef, useState } from 'react';

import { useCreateContainerItems } from '../hooks/useCreateContainerItems';
import { ContainerCapacityInfo } from './ContainerCapacityInfo';
import { ItemContainerSkeleton } from './ItemContainerSkeleton';

interface Props extends TItemContainer {
  isLoading: boolean;
}

export const ItemContainer = memo(({ capacity, id, itemsInstance, isLoading }: Props) => {
  const items = useCreateContainerItems(capacity, itemsInstance);
  const [isDrag, setIsDrag] = useState(false);
  const dragCounterRef = useRef(0);
  const { itemsTemplateById } = useGameData();
  const dragContainerStore = useDragContainerStore();
  const moveItemMutation = useMoveItemInstance();
  return (
    <section
      onDragEnter={(e) => {
        if (dragContainerStore.itemInstance?.itemContainerId === id) return;
        if (dragContainerStore.itemInstance?.location === 'EQUIPMENT') return;
        dragCounterRef.current = Math.max(dragCounterRef.current, 2);

        setIsDrag(true);
      }}
      onDragLeave={(e) => {
        if (dragContainerStore.itemInstance?.itemContainerId === id) return;
        dragCounterRef.current--;
        if (dragCounterRef.current === 0) {
          setIsDrag(false);
        }
      }}
      onDragOver={(e) => {
        if (dragContainerStore.itemInstance?.itemContainerId === id) return;
        if (dragContainerStore.itemInstance?.location === 'EQUIPMENT') return;
        e.preventDefault();
      }}
      onDrop={(e) => {
        setIsDrag(false);
        dragCounterRef.current = 0;
        const data = {
          from: dragContainerStore.itemInstance?.itemContainerId ?? '',
          to: id,
          itemInstanceId: dragContainerStore.itemInstance?.id ?? '',
        };
        moveItemMutation.mutate(data);
      }}
      className={cn('flex w-full select-none flex-col gap-0.5 border-2 border-transparent', {
        'h-fit border-green-400/50 bg-green-700/10': isDrag,
      })}
    >
      {!isLoading && (
        <div className="flex items-center gap-2">
          <ContainerCapacityInfo usedCapacity={itemsInstance.length} capacity={capacity} iconSize="size-6" />
        </div>
      )}
      <ul className="flex w-full flex-wrap gap-1">
        {!isLoading ? (
          items?.map((itemInstance) => {
            if (!itemInstance) {
              const id = crypto.randomUUID();
              return <GameItemSlot key={id} />;
            }
            const itemTemplate = itemsTemplateById[itemInstance.itemTemplateId];
            return <ItemInstanceCard key={itemInstance.id} {...itemInstance} itemTemplate={itemTemplate} />;
          })
        ) : (
          <ItemContainerSkeleton />
        )}
      </ul>
    </section>
  );
});

import { useMoveItemInstance } from '@/features/item-instance/hooks/useMoveItemInstance';
import { ItemInstance, ItemTemplate } from '@/shared/types';
import { DndContext, DragEndEvent, DragOverlay, MouseSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { PropsWithChildren, useState } from 'react';
import { GameItemImg } from '../GameItemImg';

type DraggableData = ItemInstance & { itemTemplate: ItemTemplate };

export const DndInventoryProvider = ({ children }: PropsWithChildren) => {
  const moveItemMutation = useMoveItemInstance();
  const handleDragEnd = (e: DragEndEvent) => {
    document.body.style.cursor = 'default';
    const itemInstance = e.active.data.current as DraggableData;
    if (!itemInstance.itemContainerId) return;
    if (e.over?.data.current?.to === itemInstance.itemContainerId || !e.over?.data.current?.to) return;
    setActiveItem(null);
    moveItemMutation.mutate({
      to: e.over?.data.current?.to as unknown as string,
      from: itemInstance.itemContainerId,
      itemInstanceId: itemInstance.id,
    });
  };

  const [activeItem, setActiveItem] = useState<(ItemInstance & { itemTemplate: ItemTemplate }) | null>(null);
  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const sensors = useSensors(mouseSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={(e) => {
        document.body.style.cursor = 'grabbing';
        const itemInstance = e.active.data.current as ItemInstance & { itemTemplate: ItemTemplate };
        setActiveItem(itemInstance);
      }}
    >
      {children}
      <DragOverlay dropAnimation={null}>{activeItem ? <GameItemImg image={activeItem.itemTemplate.image} /> : null}</DragOverlay>
    </DndContext>
  );
};

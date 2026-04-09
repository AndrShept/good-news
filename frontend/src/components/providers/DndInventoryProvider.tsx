import { useMoveItemInstance } from '@/features/item-instance/hooks/useMoveItemInstance';
import { useStackItemInstance } from '@/features/item-instance/hooks/useStackItemInstance';
import { TINT_COLOR } from '@/lib/config';
import { ColoredResourceType, ItemInstance, ItemTemplate } from '@/shared/types';
import { DndContext, DragEndEvent, DragOverlay, MouseSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import React, { PropsWithChildren, useState } from 'react';

import { GameItemImg } from '../GameItemImg';

type DraggableData = ItemInstance & { itemTemplate: ItemTemplate };

export const DndInventoryProvider = ({ children }: PropsWithChildren) => {
  const moveItemMutation = useMoveItemInstance();
  const stackItemMutation = useStackItemInstance();

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    if (moveItemMutation.isPending || stackItemMutation.isPending) return;
    document.body.style.cursor = 'default';
    const itemInstance = active.data.current as DraggableData;
    if (!itemInstance.itemContainerId) return;
    if (over.data.current?.to?.id !== itemInstance.itemContainerId && !!over.data.current?.to?.type) {
      setActiveItem(null);
      moveItemMutation.mutate({
        to: over.data.current?.to.id as unknown as string,
        from: itemInstance.itemContainerId,
        itemInstanceId: itemInstance.id,
      });
    }
    const draggedItem = active.data.current as DraggableData;
    const overItem = over.data.current as DraggableData;
    if (
      draggedItem.itemTemplateId === overItem.itemTemplateId &&
      draggedItem.id !== overItem.id &&
      draggedItem.itemContainerId === overItem.itemContainerId &&
      !(draggedItem.quantity >= (draggedItem.itemTemplate.maxStack ?? 1) || overItem.quantity >= (overItem.itemTemplate.maxStack ?? 1))
    ) {
      stackItemMutation.mutate({
        itemContainerId: draggedItem.itemContainerId!,
        fromItemInstanceId: draggedItem.id,
        toItemInstanceId: overItem.id,
      });
    }
  };

  const [activeItem, setActiveItem] = useState<(ItemInstance & { itemTemplate: ItemTemplate }) | null>(null);
  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 2,
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
      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <GameItemImg
            tintColor={TINT_COLOR[activeItem.coreResource ?? (activeItem.itemTemplate.key as ColoredResourceType)]}
            image={activeItem.itemTemplate.image}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

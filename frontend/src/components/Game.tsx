import { GroupInvitationModal } from '@/features/group/components/GroupInvitationModal';
import { ActionTimeRemaining } from '@/features/hero/components/ActionTimeRemaining';

import { useMoveItemInstance } from '@/features/item-instance/hooks/useMoveItemInstance';
import { ItemInstance, ItemTemplate } from '@/shared/types';
import { DndContext, DragEndEvent, DragOverlay, MouseSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';

import { GameItemImg } from './GameItemImg';
import { GameMessage } from './GameMessage';
import { GameHeader } from '@/features/hero/components/GameHeader';

type DraggableData = ItemInstance & { itemTemplate: ItemTemplate };
export const Game = () => {
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
    <>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={(e) => {
          document.body.style.cursor = 'grabbing';
          const itemInstance = e.active.data.current as ItemInstance & { itemTemplate: ItemTemplate };
          setActiveItem(itemInstance);
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col">
          <GameHeader />
          <div className="mx-auto flex min-h-[calc(100vh-315px)] w-full flex-1 items-start">
            <Outlet />
          </div>

          <div className="sticky bottom-0 z-10">
            {/* <ActionTimeRemaining /> */}
            <GameMessage />
          </div>
        </div>
        <DragOverlay dropAnimation={null}>{activeItem ? <GameItemImg image={activeItem.itemTemplate.image} /> : null}</DragOverlay>
      </DndContext>
      <GroupInvitationModal />
    </>
  );
};

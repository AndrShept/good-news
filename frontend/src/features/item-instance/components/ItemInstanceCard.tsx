import { CustomTooltip } from '@/components/CustomTooltip';
import { GameItemImg } from '@/components/GameItemImg';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ItemInstance, ItemTemplate } from '@/shared/types';
import { useDragContainerStore } from '@/store/useDragContainerStore';
import { memo, useState } from 'react';

import { GameItemSlot } from './GameItemSlot';
import { ItemInstanceCardDropdownMenu } from './ItemInstanceCardDropdownMenu';
import { ItemInstanceCardHoverTooltip } from './ItemInstanceCardHoverTooltip';

type Props = ItemInstance & {
  itemTemplate: ItemTemplate;
};
export const ItemInstanceCard = memo(function GameItemCard(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragContainerStore = useDragContainerStore();

  return (
    <GameItemSlot>
      <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div
            draggable
            className="size-full select-none"
            data-container-id={props.itemContainerId!}
            onPointerDownCapture={(e) => {
              e.stopPropagation();
            }}
            onPointerUp={() => {
              if (!isDragging) {
                setIsOpen(true);
              }
            }}
            onDragStart={(e) => {
              dragContainerStore.setItemInstance(props);
              setIsOpen(false);
              setIsDragging(true);

              e.currentTarget.style.opacity = 20 + '%';
              e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
            }}
            onDragEnd={(e) => {
              setTimeout(() => {
                setIsDragging(false);
              }, 200);
              e.currentTarget.style.opacity = 100 + '%';
            }}
          >
            <CustomTooltip>
              <CustomTooltip.Trigger>
                <>
                  <GameItemImg image={props.itemTemplate.image} />

                  {props.quantity > 1 && <div className="absolute bottom-1 right-0 size-3 text-[11px] font-semibold">{props.quantity}</div>}
                </>
              </CustomTooltip.Trigger>

              <CustomTooltip.Content>{!isOpen && !isDragging && <ItemInstanceCardHoverTooltip {...props} />}</CustomTooltip.Content>
            </CustomTooltip>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <ItemInstanceCardDropdownMenu {...props} />
        </DropdownMenuContent>
      </DropdownMenu>
    </GameItemSlot>
  );
});

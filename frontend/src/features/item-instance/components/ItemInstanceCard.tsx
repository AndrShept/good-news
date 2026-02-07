import { CustomTooltip } from '@/components/CustomTooltip';
import { GameItemImg } from '@/components/GameItemImg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ItemInstance, ItemTemplate } from '@/shared/types';
import { useSelectItemInstanceStore } from '@/store/useSelectItemInstanceStore';
import { useDraggable } from '@dnd-kit/core';
import { memo, useEffect, useState } from 'react';

import { useMoveItemInstance } from '../hooks/useMoveItemInstance';
import { GameItemSlot } from './GameItemSlot';
import { ItemInstanceCardDropdownMenu } from './ItemInstanceCardDropdownMenu';
import { ItemInstanceCardHoverTooltip } from './ItemInstanceCardHoverTooltip';

type Props = ItemInstance & {
  itemTemplate: ItemTemplate;
  setSelectItemOnContainer: (data: ItemInstance | null) => void;
  isSelect: boolean;
};

export const ItemInstanceCard = memo(function GameItemCard(props: Props) {
  const moveItemMutation = useMoveItemInstance();
  const setItemInstance = useSelectItemInstanceStore((state) => state.setItemInstance);
  const { attributes, listeners, setNodeRef, isDragging, over } = useDraggable({
    id: props.id,
    data: props,
    disabled: props.location === 'EQUIPMENT',
  });
  const [isOpen, setIsOpen] = useState(false);
  const style: React.CSSProperties = {
    // transform: CSS.Translate.toString(transform),
    opacity: isDragging || moveItemMutation.isPending ? 0.5 : 1,
    touchAction: 'none',
  };
  useEffect(() => {
    if (isDragging) {
      setIsOpen(false);
      setItemInstance(null);
    }
  }, [isDragging]);
  return (
    <GameItemSlot className={props.isSelect ? 'rounded ring-1 ring-yellow-200' : undefined}>
      <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="size-full select-none">
        <Popover
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            props.setSelectItemOnContainer(open ? props : null);
          }}
        >
          <CustomTooltip>
            <PopoverTrigger className="size-full">
              <CustomTooltip.Trigger>
                <GameItemImg image={props.itemTemplate.image} />

                {props.quantity > 1 && <div className="absolute bottom-0 right-1 text-[12px] font-semibold">{props.quantity}</div>}
              </CustomTooltip.Trigger>
            </PopoverTrigger>

            <CustomTooltip.Content>
              {!props.isSelect && !isDragging && !over?.id && <ItemInstanceCardHoverTooltip {...props} />}
            </CustomTooltip.Content>
            <PopoverContent className="bg-secondary flex h-11 w-fit select-none items-center gap-2 rounded px-2">
              <ItemInstanceCardDropdownMenu {...props} />
            </PopoverContent>
          </CustomTooltip>
        </Popover>
      </div>
    </GameItemSlot>
  );
});

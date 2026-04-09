import { CustomTooltip } from '@/components/CustomTooltip';
import { GameItemImg } from '@/components/GameItemImg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TINT_COLOR } from '@/lib/config';
import { cn } from '@/lib/utils';
import { ColoredResourceType, ItemInstance, ItemTemplate, StateType } from '@/shared/types';
import { useDndContext, useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';
import { memo, useState } from 'react';

import { GameItemSlot } from './GameItemSlot';
import { ItemInstanceCardDropdownMenu } from './ItemInstanceCardDropdownMenu';
import { ItemInstanceCardHoverTooltip } from './ItemInstanceCardHoverTooltip';

type Props = ItemInstance & {
  itemTemplate: ItemTemplate;
  heroState?: StateType;
  setSelectItemOnContainer: (data: ItemInstance | null) => void;
  isSelect: boolean;
  isRefiningBuilding?: boolean;
  isHighlight?: boolean | undefined;
};

export const ItemInstanceCard = memo(function GameItemCard(props: Props) {
  const { active } = useDndContext();
  const draggedItem = active?.data.current as ItemInstance | undefined;

  const canStack =
    props.itemTemplate.stackable &&
    draggedItem?.itemTemplateId === props.itemTemplateId &&
    draggedItem?.id !== props.id &&
    draggedItem?.itemContainerId === props.itemContainerId;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.id,
    data: props,
    disabled: props.location === 'EQUIPMENT' || (props.isRefiningBuilding && !props.isHighlight) || props.heroState !== 'IDLE',
  });
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-${props.id}`,
    data: props,
    disabled: !canStack,
  });

  const [isOpen, setIsOpen] = useState(false);
  const style: React.CSSProperties = {
    // transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'none',
  };

  useDndMonitor({
    onDragStart() {
      setIsOpen(false);
      props.setSelectItemOnContainer(null);
    },
  });
  return (
    <GameItemSlot
      className={cn('', {
        'rounded ring-1 ring-yellow-200': props.isSelect,
      })}
    >
      <div
        ref={(node) => {
          setNodeRef(node);
          setDropRef(node);
        }}
        {...attributes}
        {...listeners}
        style={style}
        className="size-full select-none"
      >
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
                <GameItemImg
                  className={cn('', {
                    'opacity-100': props.isHighlight,
                    'grayscale-100 opacity-20 group-hover:opacity-20': props.isRefiningBuilding && !props.isHighlight,
                    'ring-2 ring-green-500 duration-200': isOver && canStack,
                  })}
                  image={props.itemTemplate.image}
                  tintColor={
                    props.isRefiningBuilding && !props.isHighlight
                      ? undefined
                      : TINT_COLOR[props.coreResource ?? (props.itemTemplate.key as ColoredResourceType)]
                  }
                />

                {props.quantity > 1 && <div className="absolute bottom-0 right-1 text-[12px] font-semibold">{props.quantity}</div>}
              </CustomTooltip.Trigger>
            </PopoverTrigger>

            {!props.isSelect && !active?.data.current && (
              <CustomTooltip.Content>
                <ItemInstanceCardHoverTooltip {...props} />
              </CustomTooltip.Content>
            )}
            <PopoverContent className="bg-secondary flex h-full w-fit select-none items-center p-1">
              <ItemInstanceCardDropdownMenu {...props} />
            </PopoverContent>
          </CustomTooltip>
        </Popover>
      </div>
    </GameItemSlot>
  );
});

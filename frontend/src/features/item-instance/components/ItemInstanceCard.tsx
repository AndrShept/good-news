import { CustomTooltip } from '@/components/CustomTooltip';
import { GameItemImg } from '@/components/GameItemImg';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TINT_COLOR } from '@/lib/config';
import { cn } from '@/lib/utils';
import { ColoredResourceType, ItemInstance, ItemTemplate } from '@/shared/types';
import { itemRefineableForBuilding } from '@/shared/utils';
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
  isRefiningBuilding: boolean;
  isHighlight: boolean | undefined;
};

export const ItemInstanceCard = memo(function GameItemCard(props: Props) {
  const moveItemMutation = useMoveItemInstance();
  const setItemInstance = useSelectItemInstanceStore((state) => state.setItemInstance);
  const { attributes, listeners, setNodeRef, isDragging, over } = useDraggable({
    id: props.id,
    data: props,
    disabled: props.location === 'EQUIPMENT' || moveItemMutation.isPending,
  });
  const [isOpen, setIsOpen] = useState(false);
  const style: React.CSSProperties = {
    // transform: CSS.Translate.toString(transform),
    opacity: isDragging || moveItemMutation.isPending ? 0.4 : 1,
    touchAction: 'none',
  };
  useEffect(() => {
    if (isDragging) {
      setIsOpen(false);
      setItemInstance(null);
    }
  }, [isDragging]);
  return (
    <GameItemSlot
      className={cn('', {
        'rounded ring-1 ring-yellow-200': props.isSelect,
      })}
    >
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
                <GameItemImg
                  className={cn('', {
                    'opacity-100': props.isHighlight,
                    'grayscale-100 opacity-20 group-hover:opacity-20': props.isRefiningBuilding && !props.isHighlight,
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

            <CustomTooltip.Content>
              {!props.isSelect && !isDragging && !over?.id && <ItemInstanceCardHoverTooltip {...props} />}
            </CustomTooltip.Content>
            <PopoverContent className="bg-secondary flex h-full w-fit select-none items-center rounded p-1">
              <ItemInstanceCardDropdownMenu {...props} />
            </PopoverContent>
          </CustomTooltip>
        </Popover>
      </div>
    </GameItemSlot>
  );
});

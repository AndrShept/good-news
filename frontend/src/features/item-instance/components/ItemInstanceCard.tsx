import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ItemInstance, ItemTemplate } from '@/shared/types';
import React, { memo, useState } from 'react';

import { GameItemSlot } from './GameItemSlot';
import { ItemInstanceCardDropdownMenu } from './ItemInstanceCardDropdownMenu';
import { ItemInstanceCardHoverTooltip } from './ItemInstanceCardHoverTooltip';
import { CustomTooltip } from '@/components/CustomTooltip';
import { GameItemImg } from '@/components/GameItemImg';



type Props = ItemInstance & {
  itemTemplate: ItemTemplate
}
export const ItemInstanceCard = memo(function GameItemCard(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GameItemSlot>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="size-full">
          <CustomTooltip>
            <CustomTooltip.Trigger>
              <GameItemImg image={props.itemTemplate.image} />
              {props.quantity > 1 && (
                <div className="absolute bottom-1 right-0 size-3 cursor-default rounded-full text-center text-[11px] font-semibold">
                  {props.quantity}
                </div>
              )}
            </CustomTooltip.Trigger>
            <CustomTooltip.Content>{!isOpen && <ItemInstanceCardHoverTooltip {...props} />}</CustomTooltip.Content>
          </CustomTooltip>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <ItemInstanceCardDropdownMenu {...props} onClose={() => setIsOpen(false)} />
        </PopoverContent>
      </Popover>
    </GameItemSlot>
  );
});

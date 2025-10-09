import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Equipment, GameItem, InventoryItem } from '@/shared/types';
import React, { memo, useState } from 'react';

import { CustomTooltip } from './CustomTooltip';
import { GameItemCardPopupMenu } from './GameItemCardPopupMenu';
import { GameItemCardShowInfo } from './GameItemCardShowInfo';

interface Props {
  image: string;
  quantity: number;
}

export const GameItemCard = memo(function GameItemCard({ image, quantity }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="hover:border-primary/20 group relative size-12 border">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <CustomTooltip>
            <CustomTooltip.Trigger>
              <img
                style={{ imageRendering: 'pixelated' }}
                className="size-full object-contain opacity-85 group-hover:opacity-100"
                src={image}
                alt="inventory-image"
              />
              {quantity > 1 && (
                <div className="absolute bottom-1 right-0 size-3 cursor-default rounded-full text-center text-[11px] font-semibold">
                  {quantity}
                </div>
              )}
            </CustomTooltip.Trigger>
            <CustomTooltip.Content>{!isOpen && <GameItemCardShowInfo />}</CustomTooltip.Content>
          </CustomTooltip>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          {/* <GameItemCardPopupMenu onClose={() => setIsOpen(false)} item={inventoryItem || gameItem || equipmentItem} /> */}
        </PopoverContent>
      </Popover>
    </article>
  );
});

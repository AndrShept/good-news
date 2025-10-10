import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { InventoryItem } from '@/shared/types';
import React, { memo, useState } from 'react';

import { CustomTooltip } from './CustomTooltip';
import { GameItemCardPopupMenu } from './GameItemCardPopupMenu';
import { GameItemCardShowInfo } from './GameItemCardShowInfo';
import { GameItemSlot } from './GameItemSlot';

type Props = InventoryItem;

export const GameItemCard = memo(function GameItemCard({ id, quantity, gameItem }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GameItemSlot rarity={gameItem.rarity}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="size-full">
          <CustomTooltip>
            <CustomTooltip.Trigger>
              <img
                style={{ imageRendering: 'pixelated' }}
                className="size-full object-contain opacity-85 group-hover:opacity-100"
                src={gameItem?.image}
                alt="inventory-image"
              />
              {quantity > 1 && (
                <div className="absolute bottom-1 right-0 size-3 cursor-default rounded-full text-center text-[11px] font-semibold">
                  {quantity}
                </div>
              )}
            </CustomTooltip.Trigger>
            <CustomTooltip.Content>{!isOpen && <GameItemCardShowInfo {...gameItem} />}</CustomTooltip.Content>
          </CustomTooltip>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <GameItemCardPopupMenu
            quantity={quantity}
            id={id}
            gameItem={gameItem}
            isEquipItem={false}
            isInventoryItem={true}
            onClose={() => setIsOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </GameItemSlot>
  );
});

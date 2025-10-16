import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Equipment, GameItem, InventoryItem } from '@/shared/types';
import React, { memo, useState } from 'react';

import { CustomTooltip } from './CustomTooltip';
import { GameItemCardPopupMenu } from './GameItemCardPopupMenu';
import { GameItemCardShowInfo } from './GameItemCardShowInfo';
import { GameItemSlot } from './GameItemSlot';

export type GameCartType = 'EQUIP' | 'INVENTORY' | 'LOOT';

interface Props {
  id: string;
  quantity?: number;
  gameItem: GameItem | undefined;
  type: GameCartType;
}
export const GameItemCard = memo(function GameItemCard({ id, quantity, gameItem, type }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  if (!gameItem) return;
  return (
    <GameItemSlot>
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
              {quantity && quantity > 1 && (
                <div className="absolute bottom-1 right-0 size-3 cursor-default rounded-full text-center text-[11px] font-semibold">
                  {quantity}
                </div>
              )}
            </CustomTooltip.Trigger>
            <CustomTooltip.Content>{!isOpen && <GameItemCardShowInfo {...gameItem} />}</CustomTooltip.Content>
          </CustomTooltip>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0">
          <GameItemCardPopupMenu quantity={quantity ?? 0} id={id} gameItem={gameItem} type={type} onClose={() => setIsOpen(false)} />
        </PopoverContent>
      </Popover>
    </GameItemSlot>
  );
});

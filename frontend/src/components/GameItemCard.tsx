import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Equipment, GameItem, InventoryItem } from '@/shared/types';
import React, { memo, useState } from 'react';

import { CustomTooltip } from './CustomTooltip';
import { GameItemCardPopupMenu } from './GameItemCardPopupMenu';
import { GameItemCardShowInfo } from './GameItemCardShowInfo';

interface Props {
  item: GameItem | InventoryItem | Equipment | undefined;
}

export const GameItemCard = memo(function GameItemCard({ item }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  console.log('CARD RENDER');
  const isGameItem = !(item && 'inventoryHeroId' in item) || (item && 'equipmentHeroId' in item);
  const inventoryItem = item && 'inventoryHeroId' in item ? item : (undefined as InventoryItem | undefined);
  const equipmentItem = item && 'equipmentHeroId' in item ? item : (undefined as Equipment | undefined);
  const gameItem = isGameItem ? undefined : (item as unknown as GameItem | undefined);

  return (
    <article className="hover:border-primary/20 group relative size-12 border">
      {item && (
        <>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger className="size-full">
              <CustomTooltip>
                <CustomTooltip.Trigger>
                  <img
                    style={{ imageRendering: 'pixelated' }}
                    className="size-full object-contain opacity-85 group-hover:opacity-100"
                    src={inventoryItem?.gameItem?.image || equipmentItem?.gameItem?.image || gameItem?.image}
                    alt="inventory-image"
                  />
                  {inventoryItem && inventoryItem.quantity > 1 && (
                    <div className="absolute bottom-1 right-0 size-3 cursor-default rounded-full text-center text-[11px] font-semibold">
                      {inventoryItem.quantity}
                    </div>
                  )}
                </CustomTooltip.Trigger>
                <CustomTooltip.Content>
                  {!isOpen && (
                    <GameItemCardShowInfo gameItem={(inventoryItem && inventoryItem.gameItem) || gameItem || equipmentItem?.gameItem} />
                  )}
                </CustomTooltip.Content>
              </CustomTooltip>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <GameItemCardPopupMenu onClose={() => setIsOpen(false)} item={inventoryItem || gameItem || equipmentItem} />
            </PopoverContent>
          </Popover>
        </>
      )}
    </article>
  );
});

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Equipment, GameItem, InventoryItem } from '@/shared/types';
import React, { useRef, useState } from 'react';

import { GameItemCardPopupMenu } from './GameItemCardPopupMenu';
import { GameItemCardShowInfo } from './GameItemCardShowInfo';

interface Props {
  item: GameItem | InventoryItem | Equipment | undefined;
}

export const GameItemCard = ({ item }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isGameItem = !(item && 'inventoryHeroId' in item) || (item && 'equipmentHeroId' in item);
  const inventoryItem = item && 'inventoryHeroId' in item ? item : (undefined as InventoryItem | undefined);
  const equipmentItem = item && 'equipmentHeroId' in item ? item : (undefined as Equipment | undefined);
  const gameItem = isGameItem ? undefined : (item as unknown as GameItem | undefined);
  const handleMouseMove = (e: React.MouseEvent) => {
    const offset = 15;
    const tooltipWidth = tooltipRef.current?.offsetWidth || 200;
    const fitsRight = e.clientX + offset + tooltipWidth < window.innerWidth;

    setTooltipPos({
      x: fitsRight ? e.clientX + offset : e.clientX - tooltipWidth - 5,
      y: e.clientY + offset,
    });
  };

  return (
    <article className="hover:border-primary/20 group relative size-12 border">
      {item && (
        <>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger className="size-full">
              <div
                onMouseMove={(inventoryItem || gameItem || equipmentItem) && handleMouseMove}
                onMouseEnter={() => (inventoryItem || gameItem || equipmentItem) && setShowTooltip(true)}
                onMouseLeave={() => (inventoryItem || gameItem || equipmentItem) && setShowTooltip(false)}
              >
                <img
                  style={{ imageRendering: 'pixelated' }}
                  className="size-full object-contain opacity-85 group-hover:opacity-100"
                  src={inventoryItem?.gameItem.image || equipmentItem?.gameItem?.image || gameItem?.image}
                  alt="inventory-image"
                />
                {inventoryItem && inventoryItem.quantity > 1 && (
                  <div className="absolute bottom-1 right-0 size-3 cursor-default rounded-full text-center text-[11px] font-semibold">
                    {inventoryItem.quantity}
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <GameItemCardPopupMenu onClose={() => setIsOpen(false)} item={inventoryItem || gameItem || equipmentItem} />
            </PopoverContent>
          </Popover>

          {showTooltip && !isOpen && (
            <div
              ref={tooltipRef}
              className="bg-background/80 pointer-events-none fixed z-50 text-sm text-white shadow backdrop-blur-lg"
              style={{ top: tooltipPos.y, left: tooltipPos.x }}
            >
              <GameItemCardShowInfo gameItem={(inventoryItem && inventoryItem.gameItem) || gameItem || equipmentItem?.gameItem} />
            </div>
          )}
        </>
      )}
    </article>
  );
};

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GameItem } from '@/shared/types';
import React, { useRef, useState } from 'react';

import { GameItemCardPopupMenu } from './GameItemCardPopupMenu';
import { GameItemCardShowInfo } from './GameItemCardShowInfo';

interface Props {
  gameItem: GameItem | undefined;
  quantity?: number;
}

export const GameItemCard = ({ gameItem, quantity }: Props) => {
  const [open, setOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
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
    <li
      onMouseMove={gameItem && handleMouseMove}
      onMouseEnter={() => gameItem && setShowTooltip(true)}
      onMouseLeave={() => gameItem && setShowTooltip(false)}
      className="hover:border-primary/20 relative size-12 border group"
    >
      {gameItem && (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="size-full">
              <img className="size-full object-contain opacity-85 group-hover:opacity-100" src={gameItem.image} alt="inventory-image" />
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <GameItemCardPopupMenu gameItem={gameItem} quantity={quantity} />
            </PopoverContent>
          </Popover>

          {!open && showTooltip && (
            <div
              ref={tooltipRef}
              className="bg-background/80 pointer-events-none fixed z-50 text-sm text-white shadow backdrop-blur-lg"
              style={{ top: tooltipPos.y, left: tooltipPos.x }}
            >
              <GameItemCardShowInfo gameItem={gameItem} />
            </div>
          )}
        </>
      )}
      {quantity && quantity > 1 && (
        <div className="absolute bottom-1 right-0 size-3 cursor-default rounded-full text-center text-[11px] font-semibold">{quantity}</div>
      )}
    </li>
  );
};

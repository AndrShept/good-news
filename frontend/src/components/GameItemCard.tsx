import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GameItem } from '@/shared/types';
import React from 'react';
import { GameItemCardShowInfo } from './GameItemCardShowInfo';

interface Props {
  gameItem: GameItem | undefined;
  quantity?: number;
}

export const GameItemCard = ({ gameItem, quantity }: Props) => {
  console.log(gameItem)
  return (
    <li className="hover:border-primary/20 relative size-12 border">
      {gameItem ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="size-full">
              {' '}
              <img className="size-full object-contain opacity-85 hover:opacity-100" src={gameItem.image} alt="inventory-image" />
            </TooltipTrigger>
            <TooltipContent sideOffset={10} align='start' side="right">
             <GameItemCardShowInfo gameItem={gameItem} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
      {quantity && quantity > 1 && (
        <div className="absolute bottom-1 right-0 size-3 rounded-full text-center text-[11px] font-semibold">{quantity}</div>
      )}
    </li>
  );
};

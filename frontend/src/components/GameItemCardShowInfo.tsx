import { ShopBuyButton } from '@/features/shop/components/ShopBuyButton';
import { GameItem } from '@/shared/types';
import React from 'react';

import { ModifierInfoCard } from './ModifierInfoCard';
import { GoldIcon } from './game-icons/GoldIcon';

interface Props {
  gameItem: GameItem | undefined;
  isShowPrice?: boolean;
  isShowBuyButton?: boolean;
}
export const GameItemCardShowInfo = ({ gameItem, isShowBuyButton = false, isShowPrice = false }: Props) => {
  return (
    <article key={gameItem?.id} className="flex flex-col gap-4 border p-4 text-start">
      <section className="flex gap-4">
        <div>
          <div className="size-8 shrink-0">
            <img className="size-full object-contain" src={gameItem?.image} alt={'item-image'} />
          </div>
        </div>
        <div className="flex flex-col">
       
            <h3 className="line-clamp-2 capitalize">{gameItem?.name}</h3>
            <p className="text-muted-foreground/30 text-xs ">{gameItem?.type}</p>
        

          {gameItem?.modifier && <ModifierInfoCard modifier={gameItem.modifier} />}
        </div>
      </section>
      <div className="mt-auto flex justify-between">
        {isShowPrice && (
          <div className="flex items-center gap-0.5">
            <GoldIcon classname="size-6" />
            <p className="text-muted-foreground text-xs">{gameItem?.price}</p>
          </div>
        )}
        {isShowBuyButton && (
          <div>
            <ShopBuyButton itemId={gameItem?.id ?? ''} />
          </div>
        )}
      </div>
    </article>
  );
};

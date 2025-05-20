import { ShopBuyButton } from '@/features/shop/components/ShopBuyButton';
import { GameItem } from '@/shared/types';
import React from 'react';

import { ModifierInfoCard } from './ModifierInfoCard';
import { GoldIcon } from './game-icons/GoldIcon';
import { Button } from './ui/button';

interface Props {
  gameItem: GameItem;
}
export const GameItemCard = ({ gameItem }: Props) => {
  return (
    <li key={gameItem.id} className="flex flex-col gap-4 border p-4">
      <section className="flex gap-4">
        <div>
          <div className="size-8 shrink-0">
            <img className="size-full object-contain" src={gameItem.image} alt={'item-image'} />
          </div>
        </div>
        <div className="">
          <h3 className="line-clamp-2 capitalize">{gameItem.name}</h3>
          <p className="text-muted-foreground/30 text-xs">{gameItem.type}</p>
          <ModifierInfoCard modifier={gameItem.modifier} />
        </div>
      </section>
      <div className="mt-auto flex justify-between">
        <div className="flex items-center gap-0.5">
          <GoldIcon classname="size-6" />
          <p className="text-muted-foreground text-xs">{gameItem.price}</p>
        </div>
        <div>
          <ShopBuyButton itemId={gameItem.id} />
        </div>
      </div>
    </li>
  );
};

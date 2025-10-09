import { ShopBuyButton } from '@/features/shop/components/ShopBuyButton';
import { GameItem, GameItemType, OmitModifier } from '@/shared/types';
import React from 'react';

import { ModifierInfoCard } from './ModifierInfoCard';
import { GoldIcon } from './game-icons/GoldIcon';

interface Props {
  isShowPrice?: boolean;
  isShowBuyButton?: boolean;
  image: string;
  name: string
  type: GameItemType
  modifier: OmitModifier
}
export const GameItemCardShowInfo = ({ , isShowBuyButton = false, isShowPrice = false }: Props) => {
  return (
    <article  className="flex flex-col gap-4 border p-4 text-start">
      <section className="flex gap-4">
        <div>
          <div className="size-8 shrink-0">
            <img className="size-full object-contain" src={image} alt={'item-image'} />
          </div>
        </div>
        <div className="flex flex-col">
       
            <h3 className="line-clamp-2 capitalize">{name}</h3>
            <p className="text-muted-foreground/30 text-xs ">{type}</p>
        

          {modifier && <ModifierInfoCard modifier={modifier} />}
        </div>
      </section>
      <div className="mt-auto flex justify-between">
        {isShowPrice && (
          <div className="flex items-center gap-0.5">
            <GoldIcon  />
            <p className="text-muted-foreground text-xs">{price}</p>
          </div>
        )}
        {isShowBuyButton && (
          <div>
            <ShopBuyButton itemId={id ?? ''} />
          </div>
        )}
      </div>
    </article>
  );
};
